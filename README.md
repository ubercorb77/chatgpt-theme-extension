coolio

turtle icons:
<a href="https://www.flaticon.com/free-icons/turtle" title="turtle icons">Freepik - Flaticon</a>

svg icons:
<a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>

## TODOs:

known bugs
- (x) black/null bg img initially until i click the extension (tbh it isnt a big problem but i do wanna fix it)
- (x) would be nice to change the default null bg to some color like the default gray color perhaps
- (x) i dont know why sometimes it will say "claudey4o" and sometimes "claudey 4o"
    - im still not 100% sure why, i only have like 60% of an answer. but it works now.
- ( ) hello.html error only on first install or wtvr
    - figured out error came from reset button (not just on other tab, but Any Time)
    - talked to claude about it https://claude.ai/chat/ceabd54e-1e07-4dd3-b2ea-578e4b93079c
    - did not yet implement most recent suggested fix
    - wait i think i fixed it but then i found the same error from something else
- (X) "4o" doesnt change when you switch model
- ( ) doesnt work when doing it on different window?? tf
- (X) fixed issue where background loaded then unloaded (?) when reloading on the new chat page (somehow it was able to be fixed by just calling applyStoredValues() in the brute force loop. idk what this implies, but yeah it's alright now i guess. and i don't wanna look into it more rn)

would be nice to implement:
- claudey replacements settings
    - (x) remove (?) old "claudey replacements" toggle button
    - (x) add folder in popup.html for claudey replacements
    - name field
        - (x) HTML
        - (x) localstorage updates
        - (x) actual functionality
    - svg advanced settings (fill, color, stroke width, etc)
        - (x) HTML
        - (x) localstorage updates
        - (x) actual functionality
    - (x) icon choices
    - ( ) make sure reset works
    - ( ) make sure toggles work
- ( ) chat bubbles are claude gray but user bubbles are true gray
- ( ) need to change the popup styling bc its lowk ugly
- (x) allow the claudey thing to be turned on and off
- (x) maybe make the bubbles darker so the bg img can be lighter (and mayb make slider for that?)
- (x) Reset To Defaults button
- (x) allow user to change font (like upload a variableweight ttf file)
- ( ) allow user to change font to some google font url
- ( ) detect light/dark mode and only apply on dark mode, or also have light mode functionality
- ( ) refactor the popup html so it's more compact / less wasted space
- ( ) remove "chrome extension made by corbin!"
- (x) add an extra settings folder
- ( ) set up a donation page ??? or is that weird

before publishing:
- ( ) trim whitespace
- ( ) clean up the error handling
- ( ) remove the debug code
    - ( ) also did i do that for the latex extension?
- ( ) screenshots
- ( ) description/etc