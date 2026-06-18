/**
 * Encodes a source's deepLink payload as a ?state= URL pointing to CI v1.
 * The payload is already in internal format so deepLinkAdapter passes it through unchanged.
 */
export function buildDeepLink(source) {
  if (!source?.deepLink) return '/consumer_insights_v1'
  const encoded = btoa(JSON.stringify(source.deepLink))
  return `/consumer_insights_v1?state=${encoded}`
}
