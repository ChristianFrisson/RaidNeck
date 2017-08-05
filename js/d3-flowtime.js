/*!
 * d3-flowtime.js
 * http://github.com/d3flowtime-js/
 * MIT licensed
 *
 * Copyright (C) 2016-now Christian Frisson, http://frisson.re
 */

//var cacheTitle = document.title.replace("Flowtime.js | ", "");

d3.csv("RaidNeck.csv", function (error, slides) {
    if(error) console.log('error loading slides',error)
    var sections = d3.select(".flowtime");
    /*var section = sections.append('div')
        .attr("class","ft-section")
        .attr("data-id","section-"+1)
        //.attr("data-prog",1)*/
    var section;
    var sectionId = 0;
    var pageId = 0;
    slides.forEach(function (slide, i) {
        //console.log('slide',slide);
        if (i === 0 || slides[i].section !== slides[i - 1].section) {
            sectionId += 1;
            section = sections.append('div').attr("class", "ft-section").attr("data-id", "section-" + sectionId)
            pageId += 1;
            if (i > 0) {
                section.append('div').attr("id", "/section-" + sectionId + "/page-" + pageId).attr("class", "ft-page").attr("data-id", "page-" + pageId).attr("data-title", slide.section).append("div").attr("class", "stack-center").append("div").attr("class", "stacked-center").append('h1').text(slide.section)
            }
        }
        pageId += 1;
        var page = section.append('div').attr("id", "/section-" + sectionId + "/page-" + pageId).attr("class", "ft-page").attr("data-id", "page-" + pageId).attr("data-title", slide.section).append("div").attr("class", "stack-center").append("div").attr("class", "stacked-center")
        page.append('h1').text(slide.title);
        slide.media.split(';').forEach(function (media, mediaId) {
            /// Check if image is supported
            var isImage = false;
            var supportedImageFormats = ['jpg', 'jpeg','gif', 'png'];
            var imageExtension = media.split('.').pop();
            supportedImageFormats.forEach(function (supportedImageFormat) {
                if (imageExtension === supportedImageFormat) {
                    isImage = true;
                    //break
                }
            });
            /// Check if video is supported
            var isVideo = false;
            var supportedVideoFormats = ['mp4'];
            var videoExtension = media.split('.').pop();
            supportedVideoFormats.forEach(function (supportedVideoFormat) {
                if (videoExtension === supportedVideoFormat) {
                    isVideo = true;
                    //break
                }
            });
            /// Check if media file is pdf
            var isPdf = false;
            var supportedPdfFormats = ['pdf'];
            var pdfExtension = media.split('.').pop();
            supportedPdfFormats.forEach(function (supportedPdfFormat) {
                if (pdfExtension === supportedPdfFormat) {
                    isPdf = true;
                    //break
                }
            });
            /// Check if media file is audio
            var isAudio = false;
            var supportedAudioFormats = ['mp3'];
            var audioExtension = media.split('.').pop();
            supportedAudioFormats.forEach(function (supportedAudioFormat) {
                if (audioExtension === supportedAudioFormat) {
                    isAudio = true;
                    //break
                }
            });
            /// Check if media file is x3d
            var isX3d = false;
            var supportedX3dFormats = ['x3d'];
            var x3dExtension = media.split('.').pop();
            supportedX3dFormats.forEach(function (supportedX3dFormat) {
                if (x3dExtension === supportedX3dFormat) {
                    isX3d = true;
                    //break
                }
            });
            if (media && media.split(' ').length === 1 && isImage) {
                //console.log('slide image', media);
                page.append('img').attr('class', 'flowtimeImage').attr('id', media).attr('src', 'media/' + media)
            }
            else if (media && media.split(' ').length === 1 && isVideo) {
                //console.log('slide video', media);
                page.append('video').attr('class', 'flowtimeVideo').attr('id', media).attr('src', 'media/' + media).attr('controls', 'true"')
            }
            else if (media && media.split(' ').length === 1 && isX3d) {
                console.log('slide x3d', media);
                page.append('x3d').attr('class', 'flowtimeX3d').attr('width', '500px').attr('height', '400px').attr('id', media).append('scene').append('inline').attr('url', 'media/' + media)
            }
            else if (media && media.split(' ').length === 1 && isAudio) {
                var mediaContainer = 'page' + pageId + 'media' + mediaId;
                var waveform = page.append('div').attr('id', mediaContainer);
                waveform.append('button').attr('class', 'btn btn-primary').on('click', function () {
                    wavesurfer.playPause()
                }).text('play')
                waveform.append('i').attr('class', 'glyphicon glyphicon-play')
                var wavesurfer = WaveSurfer.create({
                    container: '#' + mediaContainer
                    , waveColor: 'gray'
                    , progressColor: 'black'
                });
                wavesurfer.load('media/' + media);
            }
            else if (media && media.split(' ').length === 1 && isPdf) {
                //console.log('slide pdf', media);
                var pdfViewer = page.append('div').attr('id', 'viewerContainer' + pageId).attr('class', 'viewerContainer').append('div').attr('id', 'viewer' + pageId).attr('class', 'pdfViewer')
                    //.attr('src','media/'+media)
                if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
                    alert('Please build the pdfjs-dist library using\n' + '  `gulp dist`');
                }
                // The workerSrc property shall be specified.
                //
                PDFJS.workerSrc = 'js/pdfjs/pdf.worker.js';
                // Some PDFs need external cmaps.
                //
                // PDFJS.cMapUrl = '../../build/dist/cmaps/';
                // PDFJS.cMapPacked = true;
                var DEFAULT_URL = 'media/' + media;
                //var SEARCH_FOR = ''; // try 'Mozilla';
                var container = document.getElementById('viewerContainer' + pageId);
                // (Optionally) enable hyperlinks within PDF files.
                var pdfLinkService = new PDFJS.PDFLinkService();
                var pdfViewer = new PDFJS.PDFViewer({
                    container: container
                    , linkService: pdfLinkService
                , });
                pdfLinkService.setViewer(pdfViewer);
                // (Optionally) enable find controller.
                var pdfFindController = new PDFJS.PDFFindController({
                    pdfViewer: pdfViewer
                });
                pdfViewer.setFindController(pdfFindController);
                container.addEventListener('pagesinit', function () {
                    // We can use pdfViewer now, e.g. let's change default scale.
                    pdfViewer.currentScaleValue = 'page-width';
                    /*if (SEARCH_FOR) { // We can try search for things
                      pdfFindController.executeCommand('find', {query: SEARCH_FOR});
                    }*/
                });
                // Loading document.
                PDFJS.getDocument(DEFAULT_URL).then(function (pdfDocument) {
                    // Document loaded, specifying document for the viewer and
                    // the (optional) linkService.
                    pdfViewer.setDocument(pdfDocument);
                    //console.log(pdfViewer)
                    pdfLinkService.setDocument(pdfDocument, null);
                });
            }
        });
        if (slide.reference) {
            page.append('p').html(slide.reference)
        }
        else if (slide.notes) {
            page.append('p').html(slide.notes)
        }
        //<div class="ft-section" data-id="section-1">
        //}
    });
    //console.log('d3 done')
    // });      
    //      document.onreadystatechange = function () {
    // if (document.readyState == "complete") {
    //console.log('ready')
    // document is ready. Do your stuff here
    //sections = ftContainer.querySelectorAll(".flowtime > " + SECTION_SELECTOR);
    //Flowtime.NavigationMatrix.update()
    Flowtime.updateNavigation()
        // Configuration API test
    Flowtime.showProgress(true);
    // Flowtime.fragmentsOnSide(true);
    // Flowtime.fragmentsOnBack(true);
    // Flowtime.useHistory(false);
    Flowtime.slideInPx(true);
    // Flowtime.sectionsSlideToTop(true);
    // Flowtime.backFromPageToTop(true);
    // Flowtime.gridNavigation(false);
    // Flowtime.useOverviewVariant(true);
    Flowtime.parallaxInPx(true);
    //
    // event management
    // Flowtime.addEventListener("flowtimenavigation", onNavigation, false);
    Flowtime.onNavigation(onNavigation);

    function onNavigation(e) {
        //_gaq.push(['_trackEvent', 'Flowtime', 'Navigation', cacheTitle + ' > ' + document.title.replace("Flowtime.js | ", "")]);
        // console.log(cacheTitle + ' > ' + document.title.replace("Flowtime.js | ", ""));
        cacheTitle = document.title.replace("Flowtime.js | ", "");
        //console.log('section', e.section, 'sectionIndex', e.sectionIndex);
        //console.log('page', e.page, 'pageIndex', e.pageIndex);
        //console.log('pastSectionIndex', e.pastSectionIndex, 'pastPageIndex', e.pastPageIndex);
        //console.log('prevSection', e.prevSection);
        //console.log('nextSection', e.nextSection);
        //console.log('prevPage', e.prevPage);
        //console.log('nextPage', e.nextPage);
        //console.log('fragment', e.fragment, + 'fragmentIndex', e.fragmentIndex);
        //console.log("isOverview", e.isOverview);
        //console.log('progress:', e.progress, 'total:', e.total);
        //var value = Math.round(e.progress * 100 / e.total);
        //console.log('Completion: ' + value + '%');
    }
    // starts the application with configuration options
    Flowtime.start();
    //   }
    // }    
});