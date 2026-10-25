<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep WhatsApp group actions in the shared GroupButtons component using the design-system Button; only the available group links out and dispatches the existing Meta Lead event (trackSingle, double-click guard only), while the full group is a native disabled button.
- Integrate the original perfume asset through CSS edge masks rather than altering or replacing the uploaded image, preserving product detail.
- Keep Pixel loading, regional consent and choice storage in src/lib/meta-pixel.ts (single shell install, shared gate with Lead); the ConsentBar in __root only appears in consent regions and loads the Pixel solely after Aceitar.
- Cookieless aggregate counters (visits, WhatsApp clicks, Meta dispatches) live in src/lib/metrics.ts via a whitelisted increment_metric RPC on daily totals; the /relatorio page reads them through a password-checked server function, independent of ad consent.
