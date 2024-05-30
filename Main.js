import { useEffect, useRef, useState } from 'react'

const tf = require('@tensorflow/tfjs')
const mobilenetModule = require('@tensorflow-models/mobilenet')
const knnClassifier = require('@tensorflow-models/knn-classifier')

var classifier= undefined
var mobilenet= undefined

const Main= ()=>{

    //image
    const imgs= [
        'https://cdn.pixabay.com/photo/2018/05/17/06/22/dog-3407906_1280.jpg',
        'https://cdn.pixabay.com/photo/2021/12/30/01/48/dog-6903071_1280.jpg',
        'https://cdn.pixabay.com/photo/2017/07/01/02/17/cat-2460394_1280.jpg',
        'https://cdn.pixabay.com/photo/2019/01/12/06/09/bengal-3928039_1280.jpg',
        'https://cdn.pixabay.com/photo/2020/03/06/10/55/cat-4906764_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/02/22/10/06/hedgehog-1215140_1280.jpg',
    ]
    const [num, setNum]= useState(0)
    
    useEffect(()=>{
        classifier= knnClassifier.create()
        mobilenetModule.load().then(model=>{
            mobilenet= model

            

            const str= localStorage.getItem('dataset')
            console.log(str)
            classifier.setClassifierDataset( Object.fromEntries( JSON.parse(str).map(([label, data, shape])=>[label, tf.tensor(data, shape)]) ) );

            alert('학습한 클래스 개수 : ' + classifier.getNumClasses())


            setLoad(true)
        })
    },[])


    const [load, setLoad] =  useState(false)

    const clickNext= ()=>{

        console.log(inputRef.current.value)

        const img0 = tf.browser.fromPixels(imgRef.current);
        const logits0 = mobilenet.infer(img0, true);
        classifier.addExample(logits0, inputRef.current.value);

        let n= num+1
        if(n==imgs.length) n=0
        setNum(n)
    }

    

    const clickBtn= ()=>{
        alert('학습한 클래스 개수 : ' + classifier.getNumClasses())

        const dataset= classifier.getClassifierDataset()
        let str = JSON.stringify(Object.entries(dataset).map(([label, data])=>[label, Array.from(data.dataSync()), data.shape]) );
        localStorage.setItem("dataset",str)
        console.log(str)
    }

    const clickBtn2= async ()=>{
        const x = tf.browser.fromPixels(imgRef2.current);
        const xlogits = mobilenet.infer(x, true);
        console.log(classifier.predictClass(xlogits));

        const result= await classifier.predictClass(xlogits)
        alert( result.label + " : " + result.confidences[result.label] )

    }

    const imgRef= useRef()
    const inputRef= useRef()
    const imgRef2= useRef()


    const im='https://cdn.pixabay.com/photo/2016/10/21/19/39/hedgehog-child-1759006_1280.jpg'
    const im2='https://cdn.pixabay.com/photo/2018/09/24/09/53/spitz-3699480_1280.jpg'

    return (
        <div style={{padding:16,}}>

            {
                load ?
                (
                    <div>

                        <img src={imgs[num]} style={{height:150}} ref={imgRef} crossOrigin="anonymous"></img>
                        <br></br>
                        <input placeholder='class name' ref={inputRef}></input>
                        <br></br>
                        <button onClick={clickNext}>next</button>
                        <hr></hr>
                        <button onClick={clickBtn}>training</button>

                        <hr></hr>
                        <img src={im2} style={{height:150}} ref={imgRef2} crossOrigin='anonymous'></img>
                        <br></br>
                        <button onClick={clickBtn2}>prediction</button>
                        
                    </div>
                )
                :
                (
                    <h2>please wait ... for loading classifier</h2>
                )
            }
            
        </div>
    )
}
export default Main