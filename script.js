import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'
import axiosTiming from 'axios-timing'
import axiosTime from 'axios-time'
import prettyBytes from 'pretty-bytes'
import setupEditors from './Editorsetup'
const {requestEditor,updateResponseEditor}=setupEditors()
const form=document.querySelector('[data-form]')
const dataMethod=document.querySelector('[data-method]')
const dataUrl=document.querySelector('[data-url]')
const queryParamsContainer=document.querySelector('[data-query-params]')
const requestHeadersContainer=document.querySelector('[data-request-headers]')
const keyValuePairTemplate=document.querySelector('[data-key-value-template]')
const responseHeadersContainer=document.querySelector('[data-response-header')
queryParamsContainer.append(createKeyValuepair())
requestHeadersContainer.appendChild(createKeyValuepair())
document.querySelector('[data-add-request-header-btn]').addEventListener('click',()=>{
    requestHeadersContainer.append(createKeyValuepair())
})
document.querySelector('[data-add-query-param-btn]').addEventListener('click',()=>{
    queryParamsContainer.append(createKeyValuepair())
})
function createKeyValuepair(){
    const element=keyValuePairTemplate.content.cloneNode(true)
    element.querySelector('[data-remove-btn]').addEventListener('click',(e)=>{
        e.target.closest("[data-key-value-pair]").remove()
    })
    return element
}
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    console.log(dataMethod.value)
    console.log(keyValuePairToObjects(queryParamsContainer))
    console.log(keyValuePairToObjects(requestHeadersContainer))
    axiosTime(axios)
    let jsondata;
    try {
        jsondata=JSON.parse(requestEditor.state.doc.toString()) || null
        console.log(jsondata)
    } catch (error) {
        return alert("Check JSON Correctly")
    }
    axios({
        method:dataMethod.value,
        url:dataUrl.value,
        params:keyValuePairToObjects(queryParamsContainer),
        headers:keyValuePairToObjects(requestHeadersContainer),
        data:jsondata,
    }).catch(e=>e.response)
    .then(res=>{
        console.log(res)
        document.querySelector('[data-response-section]').classList.remove("d-none")
        updateResponseDetails(res)
        updateResponseHeaders(res.headers)
        updateResponseEditor(res.data)
    })
})

function updateResponseDetails(res){
    document.querySelector('[data-status]').innerHTML=res.status
    document.querySelector('[data-time]').innerHTML=res.timings.elapsedTime
    document.querySelector('[data-status]').style.color=res.status===404 ?"red":"green"
    document.querySelector(['[data-size]']).innerHTML=prettyBytes(JSON.stringify(res.data).length+JSON.stringify(res.headers).length)
}
function updateResponseHeaders(headers){   
    responseHeadersContainer.innerHTML=""
    Object.entries(headers).forEach(([key,value])=>{
        const keyElement=document.createElement('div')
        keyElement.textContent=key
        responseHeadersContainer.append(keyElement)
        const valueElement=document.createElement('div')
        valueElement.textContent=value
        responseHeadersContainer.append(valueElement)

    })

}
function keyValuePairToObjects(container){
    const pairs=container.querySelectorAll('[data-key-value-pair')
    return [...pairs].reduce((data,pair)=>{
        const key=pair.querySelector('[data-key]').value
        const value=pair.querySelector('[data-value]').value
        if(key==='')return data
        return {...data,[key]:value}
    },{})
}