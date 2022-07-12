const video = document.getElementById('videoInput');

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models') //heavier/accurate version of tiny face detector
]).then(start)

function start() {
    document.body.append('Models Loaded')

    navigator.getUserMedia(
        { video:true },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    console.log('video added')
    recognizeFaces()
}

async function recognizeFaces() {

    const labeledDescriptors = await loadLabeledImages()
    console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6)

    console.log('jjgnmgnmnmgnmnm');
    video.addEventListener('play', async () => {
        console.log('Playing')
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)

        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)



        setInterval(async () => {
          console.log('in async');
          console.log(video);
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
            console.log(detections);
            console.log('printed detections');
            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            console.log('rectangle');
            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            results.forEach( (result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
            })
        }, 1)



    })
}


function loadLabeledImages() {
    const labels = ['el','max','will','vyshnavi','mike','vaishnavi','steve','nancy','uma','jonathon','hopper','joyce','lucus','dustin','robin'];
        return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=2; i++) {
                const img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}
