import { createClient } from "@supabase/supabase-js"

const url ="https://rysncufvmydrdeggnkes.supabase.co"
const key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c25jdWZ2bXlkcmRlZ2dua2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDM3MTMsImV4cCI6MjA3ODk3OTcxM30.FFNXUQ-BCE75jj60aAiif6ZD0PU1Os_NBJR7LSXkzqE"

const supabase = createClient(url, key)

export default function mediaUpload(file){

    const mediaUploadPromise = new Promise(
        (resolve, reject) => {
            if(file == null){
                reject("file is null")
            }

            const timestamp = new Date().getTime()
            const fileName =timestamp+file.name

            supabase.storage.from('images').upload(fileName,file,{
                upsert:false,
                cacheControl: '3600'
               
            }).then(()=>{

                const publicUrl = supabase.storage.from('images').getPublicUrl(fileName)
                resolve(publicUrl.data.publicUrl)

            }).catch((error)=>{
                reject(error)
            })
        }
    )

    return mediaUploadPromise
}