// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import * as yup from 'yup'
import axios from 'axios'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
const initialFormValue = {
  username: '',
  favFood: '',
  favLanguage: '',
  agreement: null,
}



// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const formSchema= yup.object().shape({
  username: yup.string()
    .required('username is required')
    .min(3, e.usernameMin)
    .max(20,'username cannot exceed 20 characters'),
  favLanguage: yup.string()
    .required('favLanguage is required')
    .oneOf(['javascript', 'rust'], 'favLanguage must be either javascript or rust'),
  favFood: yup.string()
    .required('favFood is required')
    .oneOf(['broccoli', 'spaghetti', 'pizza'], 'favFood must be either broccoli, spaghetti, or pizza'), 
  agreement: yup.boolean()
    .oneOf([true],'agreement is required' )
    .required()




})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [formValue, setFormValue] = useState(initialFormValue)
  const [formError, setFormError] = useState({
    username: '',
    favFood: '',
    favLanguage: '',
    agreement: '',
  })
  const [submit, setSubmit] = useState(false)
  const [success, setSuccess] = useState('')
  const [failure, setFailure] = useState('')


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    console.log(formValue)
    formSchema.isValid(formValue).then(setSubmit)
  }, [formValue])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let { type, name, checked, value } = evt.target
    if (type == 'checkbox') value = checked
    setFormValue({ ...formValue, [name]: value })
    yup.reach(formSchema, name).validate(value)
      .then(() => setFormError({ ...formError, [name]: ''}))
      .catch(err => {
        console.log(err)
        console.log(err.errors)
        if ( err.errors ) {
           setFormError({ ...formError, [name]: err.errors[0] })
        }
      })
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    console.log('testing')
    axios.post('https://webapis.bloomtechdev.com/registration', formValue)
    .then(res => {
      console.log(res.data)
      setSuccess(res.data.message)
      setFailure(failure)
    }).catch(err => {
      setFailure(err.response.data.message)
      setSuccess(success)
    
    })

  }
  

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {success && <h4 className='success'>{success}</h4>}
        {failure && <h4 className='error'>{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" onChange= {onChange} value={formValue.username} placeholder="Type Username" onChange={onChange} />
          { formError.username && <div className='validation'>{formError.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" onChange= {onChange} value="javascript" />
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" onChange= {onChange} value="rust" />
              Rust
            </label>
          </fieldset>
          {formError.favLanguage && <div className='validation'>{formError.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange= {onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {formError.favFood && <div className='validation'>{formError.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" onChange= {onChange} name="agreement" />
            Agree to our terms
          </label>
          {formError.agreement && <div className='validation'>{formError.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!submit} />
        </div>
      </form>
    </div>
  )
}
