const CF_API = "https://api.cloudflare.com/client/v4";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  };
}

export async function createCnameRecord(subdomain: string, target: string): Promise<string> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID!;
  const res = await fetch(`${CF_API}/zones/${zoneId}/dns_records`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      type: "CNAME",
      name: subdomain,
      content: target,
      ttl: 1,
      proxied: false,
    }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message ?? "Cloudflare error");
  }
  return data.result.id as string;
}

export async function deleteCnameRecord(recordId: string): Promise<void> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID!;
  const res = await fetch(`${CF_API}/zones/${zoneId}/dns_records/${recordId}`, {
    method: "DELETE",
    headers: headers(),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message ?? "Cloudflare error");
  }
}
