// video change js

var player = new Clappr.Player(
    {
        source: "http://uploadingsite.com/?op=download2&id=l3jk7tczb19m",
        mimeType: "video/webm",
        plugins: [DashShakaPlayback, LevelSelector],
        watermark: "https://geniechill.vercel.app/css/ymglogo.png",
        watermarkLink: "https://geniechill.vercel.app",
        width: "100%",
        autoPlay: false,
        shakaConfiguration: {
            preferredAudioLanguage: 'pt-BR',
            streaming: {
                rebufferingGoal: 15
            }
        },
        shakaOnBeforeLoad: function (shaka_player) {
            // shaka_player.getNetworkingEngine().registerRequestFilter() ...
        },
        parentId: '#player',

    });