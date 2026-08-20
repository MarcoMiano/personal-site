const revisionPattern = /^[0-9a-f]{40}$/;

export type BuildRevision =
  | { value: 'LOCAL'; short: 'LOCAL'; url: undefined }
  | { value: string; short: string; url: string };

export function resolveBuildRevision(
  suppliedRevision: string | undefined,
): BuildRevision {
  if (suppliedRevision === undefined) {
    return { value: 'LOCAL', short: 'LOCAL', url: undefined };
  }

  if (!revisionPattern.test(suppliedRevision)) {
    throw new Error(
      'SITE_BUILD_REVISION must be exactly 40 lowercase hexadecimal characters',
    );
  }

  return {
    value: suppliedRevision,
    short: suppliedRevision.slice(0, 12),
    url: `https://github.com/MarcoMiano/personal-site/commit/${suppliedRevision}`,
  };
}
