# Chhota Dino, Badi Bhookh · Research and design notes

## Design for a five-year-old

A picture of the requested fruit provides a concrete cue. Three choices keep the task focused on a single match. A wrong choice leaves the same target available and highlights the matching fruit. Naming the fruit aloud is an optional caregiver activity.

## Evidence and application

- **Guided play.** Skene et al. (2022) reviewed guided play across multiple outcomes. The reported benefits varied by outcome and comparison. Here, picture prompts and optional spoken labels provide guidance while the child chooses the next action. [Systematic review and meta-analysis](https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdev.13730)
- **Shape learning.** Fisher et al. (2013) observed better shape knowledge following a guided-play activity in their setting. The train game adapts the idea of exploration with cues into a short matching activity. [Original study](https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdev.12091)
- **Caregiver participation.** The AAP clinical report discusses developmentally appropriate play with caregivers and peers. An adult can take turns, name discoveries, or continue the activity with objects around the room. [AAP clinical report](https://publications.aap.org/pediatrics/article-abstract/142/3/e20182058/38649)
- **Accessible controls.** The implementation uses native buttons, large tap targets, visible focus and a reduced-motion stylesheet. Audio begins only when the player enables it. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [W3C animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)

## Evaluation plan

Observe whether a child can start with one prompt, complete a round, and replay. Try touch, keyboard, muted audio and system reduced motion. For a mismatch, check that the next successful action is clear and that progress is preserved. These are research-informed design choices. The games have no measured learning outcomes or child usability study.

## Implementation

Browser-side HTML, CSS, JavaScript, Web Audio and optional device speech synthesis. Replay variation comes from shuffled predefined content. The games have no runtime generative AI, login, analytics or data collection.
