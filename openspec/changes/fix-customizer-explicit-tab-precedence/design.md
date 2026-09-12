# Design

Expose explicit-tab presence at the existing route parsing boundary instead of using the parsed default value as a proxy. The customizer composition uses that signal when deciding whether the persisted last subtab may apply. Keep navigation/store hydration effects stable and preserve campaign-specific routing. A test must pair explicit Structure with a different stored last tab and also prove omission still restores that stored tab. The existing compatible weapons route remains accepted.
