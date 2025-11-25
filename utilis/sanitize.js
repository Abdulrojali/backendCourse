const validator = require('validator')

 function sanitizeDataInput(data){
  if (!data) return "";

  const str = String(data);
                       const replaceOnlyText= str.replace(/<[^>]*>/g, ''); 
                        const cleanText=validator.whitelist(replaceOnlyText,'a-zA-Z0-9 ')
                        return cleanText
}

function validateEmail(data){
      if(validator.isEmail(data)){
        return data.trim()
      }
      else{
        console.log()
      }
    }
module.exports={sanitizeDataInput,validateEmail}

