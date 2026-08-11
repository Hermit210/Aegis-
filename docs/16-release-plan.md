# Release Plan

## v0.1 (Week 3 internal checkpoint, not public)
Pre-flight stage only (`rpcchainvm-compat`, `config-resolution`, `port-availability`). Internal use / self-testing against Week 0 fixtures. Not tagged or announced — used to validate the `Check` interface and registry pattern hold up before building the post-deploy side on top of them.

## v0.2 (Week 6 internal checkpoint, not public)
Adds post-deploy stage (`validator-set-diff`, `network-status-diff`, `genesis-consistency`). First point at which the tool can reproduce all three historical bugs (#2594, #2526, #2535) end to end. Shared privately with 2–3 trusted builders for a sanity check before the wider Week 7 beta.

## v0.5 (Week 7–8, public beta)
`doctor` command, JSON schema, health scoring, CI templates. Tagged pre-release on GitHub (`v0.5.0-beta`), announced to the 5–10 beta builders recruited in Document 09. Explicitly labeled beta — false positives/negatives are expected and solicited as feedback, not treated as launch failures.

## v1.0 (Week 10, public release)
Incorporates beta feedback fixes. Full documentation set (Documents 01–19, adapted into repo docs). Builder Hub troubleshooting-docs PR submitted alongside. This is the grant-deliverable release.

## Post-v1.0 (unfunded, best-effort)
Governed by real adoption evidence per Document 11 (V2 roadmap) — no committed date, no committed scope beyond what's stated there.

## Versioning Policy
Semantic versioning. Any change to the JSON schema (Document 04 §3) is a minor version bump minimum, with the schema version embedded in output (`toolVersion` field) so CI consumers can detect breaking changes deliberately rather than silently.
