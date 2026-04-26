export const config = { runtime: "edge" };

const ALLOWED_EVENTS = new Set([
	"cli.run",
	"cli.template-selected",
	"cli.install-completed",
	"cli.install-skipped",
	"cli.aborted",
	"cli.error",
]);

const ALLOWED_PROPERTY_KEYS = new Set([
	"cliVersion",
	"nodeMajor",
	"platform",
	"arch",
	"osRelease",
	"anonymousId",
	"moduleName_isScoped",
	"moduleName_lengthBucket",
	"template_isDefault",
	"template_refKind",
	"result",
	"reason",
	"errorClass",
]);

const FORWARD_TIMEOUT_MS = 1_500;

type IncomingPayload = {
	v?: number;
	event?: string;
	properties?: Record<string, unknown>;
};

function jsonResponse(status: number, body: unknown): Response {
	return new Response(body == null ? null : JSON.stringify(body), {
		status,
		headers: body == null ? undefined : { "content-type": "application/json" },
	});
}

function nowNanos(): string {
	return `${BigInt(Date.now()) * 1_000_000n}`;
}

function sanitizeProperties(input: Record<string, unknown> | undefined) {
	const out: Record<string, string | number | boolean> = {};
	if (!input) return out;
	for (const [key, value] of Object.entries(input)) {
		if (!ALLOWED_PROPERTY_KEYS.has(key)) continue;
		if (typeof value === "string" && value.length <= 200) {
			out[key] = value;
			continue;
		}
		if (typeof value === "number" && Number.isFinite(value)) {
			out[key] = value;
			continue;
		}
		if (typeof value === "boolean") {
			out[key] = value;
		}
	}
	return out;
}

function toOtlpLogsPayload(
	event: string,
	props: Record<string, string | number | boolean>,
) {
	const attributes = Object.entries(props).map(([key, value]) => {
		if (typeof value === "string") {
			return { key, value: { stringValue: value } };
		}
		if (typeof value === "boolean") {
			return { key, value: { boolValue: value } };
		}
		return { key, value: { doubleValue: value } };
	});
	attributes.push({ key: "event", value: { stringValue: event } });

	return {
		resourceLogs: [
			{
				resource: {
					attributes: [
						{ key: "service.name", value: { stringValue: "create-coral" } },
						{ key: "service.namespace", value: { stringValue: "coral" } },
					],
				},
				scopeLogs: [
					{
						scope: { name: "create-coral.telemetry", version: "1" },
						logRecords: [
							{
								timeUnixNano: nowNanos(),
								observedTimeUnixNano: nowNanos(),
								severityNumber: 9,
								severityText: "INFO",
								body: { stringValue: event },
								attributes,
							},
						],
					},
				],
			},
		],
	};
}

async function forwardToGrafana(payload: unknown): Promise<void> {
	const endpoint = process.env.GRAFANA_OTLP_ENDPOINT?.trim();
	const instanceId = process.env.GRAFANA_INSTANCE_ID?.trim();
	const token = process.env.GRAFANA_OTEL_TOKEN?.trim();
	if (!endpoint || !instanceId || !token) return;

	const url = `${endpoint.replace(/\/+$/, "")}/v1/logs`;
	const auth = btoa(`${instanceId}:${token}`);
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
	try {
		await fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Basic ${auth}`,
			},
			body: JSON.stringify(payload),
			signal: controller.signal,
		});
	} catch {
		// Forwarder failures must not surface to the CLI.
	} finally {
		clearTimeout(timer);
	}
}

export default async function handler(request: Request): Promise<Response> {
	if (request.method !== "POST") {
		return jsonResponse(405, { error: "method not allowed" });
	}

	let body: IncomingPayload;
	try {
		body = (await request.json()) as IncomingPayload;
	} catch {
		return jsonResponse(400, { error: "invalid json" });
	}

	if (!body || typeof body !== "object" || typeof body.event !== "string") {
		return jsonResponse(400, { error: "missing event" });
	}

	if (!ALLOWED_EVENTS.has(body.event)) {
		return jsonResponse(400, { error: "unknown event" });
	}

	const properties = sanitizeProperties(
		body.properties as Record<string, unknown>,
	);
	await forwardToGrafana(toOtlpLogsPayload(body.event, properties));

	return new Response(null, { status: 204 });
}
