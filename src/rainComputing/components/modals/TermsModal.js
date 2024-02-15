import React from 'react'
import "./Terms.css"
import { useState } from 'react'
function TermsModal() {

    const [Terms,setTerms] = useState(false);
  return (
    <div className=''>
                <div className=''>
                    <div className='heading'>Rain Computing</div>
                    {/* <button id="close"> Back</button> */}
                </div>
                <div>
                    <h3>Introduction</h3>
                    <p className='my-3'>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Webiste Name accessible at Website.com.

                        These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.

                        Minors or people below 18 years old are not allowed to use this Website.</p>
                        

                    <h3>Intellectual Property Rights</h3>
                    <p className='my-3'>Other than the content you own, under these Terms, Company Name and/or its licensors own all the intellectual property rights and materials contained in this Website.

                    You are granted limited license only for purposes of viewing the material contained on this Website.</p>

                    <h3>Your Content</h3>
                    <p className='my-3'>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, 
                        images or other material you choose to display on this Website. By displaying Your Content, you grant 
                        Company Name a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, 
                        publish, translate and distribute it in any and all media.</p>
                </div>
            </div>

  )
}

export default TermsModal

