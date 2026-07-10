# 30 — License Recommendation

## Recommended: MIT License

## Rationale

- **Matches ecosystem norms.** `avalanche-cli`, `avalanchego`, and `hypersdk` all use permissive licensing; MIT creates zero friction for anyone wanting to reference, extend, or embed this project's check logic elsewhere, including potentially other Avalanche tooling maintainers.
- **Adoption is the goal.** This project's entire value depends on wide, trusted usage (Document 27, Success Metrics). A copyleft license (GPL/AGPL) adds legal-review friction for teams wanting to embed it in CI or internal tooling, working directly against that goal.
- **No commercialization to protect against.** This project is committed to remaining open source and non-commercial (Document 25). MIT doesn't need a copyleft mechanism to enforce that, since there is no proprietary derivative being defended against — the goal is maximal reuse, not restriction.
- **Grant-friendly.** Team1 and comparable ecosystem grant programs generally expect permissively licensed deliverables.

## Alternative Considered: Apache 2.0

Apache 2.0 adds an explicit patent grant, more relevant for projects with meaningful patentable technical innovation. This project's value is in its specific check implementations and verification methodology, not patentable IP, so the added complexity (NOTICE file requirements, more verbose headers) isn't justified relative to the marginal benefit. MIT is simpler and equally protective for this project's actual risk profile.

---

## LICENSE (file contents)

```
MIT License

Copyright (c) 2026 Avalanche Deploy Assurance Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
