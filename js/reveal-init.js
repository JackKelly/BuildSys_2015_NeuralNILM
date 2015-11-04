// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
    controls: false,
    progress: false,
    history: true,
    center: true,

    transition: 'none', // none/fade/slide/convex/concave/zoom

    // The "normal" size of the presentation, aspect ratio will be preserved
    // when the presentation is scaled to fit different resolutions. Can be
    // specified using percentage units.
    width: 1000,
    height: 750,

    // Factor of the display size that should remain empty around the content
    margin: 0.05,

    // Bounds for smallest/largest possible scale to apply to content
    minScale: 0.2,
    maxScale: 1.5,

    // Optional reveal.js plugins
    dependencies: [
        { src: 'bower_components/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'bower_components/reveal.js/plugin/zoom-js/zoom.js', async: true },
        { src: 'bower_components/reveal.js/plugin/notes/notes.js', async: true }
    ]
});
