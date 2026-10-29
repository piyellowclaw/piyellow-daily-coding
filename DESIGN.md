# Exhibition design

The gallery is an exhibition interface, not a blog feed. It should change when the work needs a different encounter, rather than impose a permanent visual brand on every piece.

## Principles
- Give one work enough scale to be encountered before offering an archive.
- Distinguish a captured image from a running program. Live execution is explicit, with a visible stop that removes the iframe. Do not start every archived system at once.
- Put the artistic question, formal decisions, temporal behavior and participation beside the work. Technical metadata is not a substitute for a concept.
- Use neutral space, typographic hierarchy and an unambiguous index. Avoid assuming neon, dark mode or simulated terminal graphics make something new-media art.
- Respect keyboard access, small screens, reduced motion, loading failures and bounded computational cost. No tracking, remote fonts, visitor uploads or autoplay audio.
- Review exhibition fit alongside each new work. Change layout, scale, typography, color or viewing mode only for an observed mismatch, not to satisfy a redesign quota. Keep work URLs, source provenance and the artwork itself intact.

## Reference survey — 2026-10-30
Public sites inspected for presentation structure, not copied for assets or code:
- [Feral File](https://feralfile.com/): a strongly reduced entrance separating exhibitions from living with digital art; useful separation of modes, but not enough explanatory structure for this small archive on its own.
- [REAS](https://reas.com/): large work imagery, a persistent series index and substantial practice text. Work and language share the page rather than reducing each series to a promotional card.
- [NEORT](https://neort.io/): image-led playlists and a dense browsable collection. Useful as the archive grows; a one-work practice does not yet need that feed density.
- [NEORT++](https://two.neort.io/en): its public introduction frames the viewing experience as a question beyond the screen. Text inspected; its physical exhibition experience was not assessed.

## Current implementation
An exhibition-first diptych: captured or explicitly activated work at left; label and description at right. Full concept follows, then searchable chronological index. Mobile becomes a single reading sequence. No dependencies or third-party graphics. Structured concept fields travel through the static manifest as plain text, never HTML.

Future changes require source/privacy review, regression tests, responsive and actual public rendering checks, exact scoped commits and anonymous delivery verification. Shared browser/network policy, hosting, identity and paid services are outside design scope.
