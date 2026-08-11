# License Recommendation

**Recommended: MIT License**

## Why MIT

- **Matches the ecosystem norm.** `avalanche-cli`, `avalanchego`, and `hypersdk` are all BSD/Ecosystem-license-adjacent permissive licenses; MIT is the most common permissive choice in the immediate Avalanche tooling space and creates zero friction for anyone wanting to reference, extend, or embed this tool's check logic elsewhere (e.g., an `avalanche-deploy` maintainer lifting the diff logic per Document 13/20's differentiation discussion).
- **Maximizes adoption, which is the actual goal.** This project's value depends entirely on builders trusting and using it widely (Document 08 success metrics: 10+ external builders). A copyleft license (GPL/AGPL) adds legal review friction for teams wanting to embed it in CI or internal tooling, which directly works against the adoption goal.
- **No commercialization concern to protect against.** Document 14 already commits this project to staying open source and non-commercial. MIT doesn't need a copyleft mechanism to enforce that commitment, because there's no proprietary derivative to defend against — the entire point is for people to freely reuse the check logic.
- **Grant-friendly.** Team1 and similar ecosystem grant programs generally expect permissively licensed deliverables; MIT is the least-friction choice for a grant reviewer to evaluate.

## Alternative Considered: Apache 2.0

Apache 2.0 adds an explicit patent grant, which matters more for projects with meaningful patentable technical innovation. This project's value is in the specific, evidenced check implementations and the diagnostic methodology, not patentable IP — so the extra complexity of Apache 2.0 (NOTICE file requirements, more verbose headers) isn't worth it for marginal benefit. MIT is simpler and equally protective for this project's actual risk profile.

---

## LICENSE (file contents)

```
MIT License

Copyright (c) 2026 <Project Author>

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
