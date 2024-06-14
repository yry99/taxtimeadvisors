console.log("hello world from form.js")

const getForm = document.getElementById("form")


function getValues(input) {
    if (document.getElementById(input) != null && document.getElementById(input).value != '') {
        return document.getElementById(input).value
    }
    else {
        return false
    }
}


const isRequired = value => value === '' ? false : true

const isNumbersValid = (input) => {
    const regex = /^\d*\.?\d*$/
    return regex.test(input)
}

const isAlphaNumericValid = (input) => {
    const regex = /^[a-z_ ]+$/i
    return regex.test(input)
}

const isEmailValid = (input) => {

    const regex = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,5}/
    return regex.test(input)
}

const createValidator = (validator, errorMessage) => {
    return (input) => {
        const get_field = document.querySelector(`#${input}`);
        const id_name = input.split("_").map((ele) => ele.replace(ele[0], ele[0].toUpperCase())).join(' ')
        let valid = false;
        const formattedValue = get_field.value.trim();

        if (!isRequired(formattedValue)) {
            showError(get_field, `${id_name} shouldn't be empty`);
        } else if (!validator(formattedValue)) {
            showError(get_field, errorMessage);
        } else {
            showSuccess(get_field);
            valid = true;
        }

        return valid;
    };
};

const checkNumberFields = createValidator(isNumbersValid, "Should only contain numbers");

const checkAlphaNumeric = createValidator(isAlphaNumericValid, "Should only contain alphabets");

const checkEmail = createValidator(isEmailValid, "Should only contain Emails");


const showError = (inp, msg) => {
    const error_fld = inp.nextElementSibling
    inp.classList.add('is-invalid')
    inp.classList.remove('is-valid')
    error_fld.textContent = msg
    error_fld.style.color = "yellow"
    document.getElementById("sub_btn").classList.add("disabled")

}

const showSuccess = (inp) => {
    const error_fld = inp.nextElementSibling
    inp.classList.add('is-valid')
    inp.classList.remove('is-invalid')
    error_fld.textContent = ""
    document.getElementById("sub_btn").classList.remove("disabled")

}


const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

document.querySelector("#form").addEventListener("input", debounce(function (e) {
    switch (e.target.id) {
        case 'form_name':
            checkAlphaNumeric(e.target.id);
            break;
        case 'form_email':
            checkEmail(e.target.id);
            break;
        case 'form_contact_no':
            checkNumberFields(e.target.id);
            break;
        
    }
}))


const form_validation_client = (a,b,c,d,e) => {
    let form_name = checkAlphaNumeric("form_name"),
        form_email = checkEmail("form_email"),
        form_contact_no = checkNumberFields("form_contact_no")
        // form_message = checkNumberFields("form_message")
        // form_service = getForm("form_services")

    const variablesArray = [
        form_name,
        form_email,
        form_contact_no
        // form_message
    ];

    const areAllVariablesValid = variablesArray.every(value => value);
    if (areAllVariablesValid === true) {
        postDataAndGetId(a,b,c,d,e)
    }
    else{
        console.log("not working")
    }

}


async function postDataAndGetId(a,b,c,d,e) {
    try {
        const formData = new FormData();
        formData.append('name', a);
        formData.append('email', b);
        formData.append('mobile', c);
    
        formData.append('service', d);
        formData.append('message', e);
        
        const add_new_users_url = `https://w3xknzgiok.execute-api.ap-southeast-2.amazonaws.com/items`;
        const response1 = await fetch(add_new_users_url, {
            method: 'PUT',
            body: formData,
            mode: "cors",
            headers: {"Content-type": "application/json; charset=UTF-8"}
            //   redirect: "follow",
            // referrerPolicy: "no-referrer"
        });
        if (!response1.ok) {
            throw new Error('Failed to add new user data');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        throw error; // Rethrow the error to be caught by the caller
    }
}


getForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const get_name = getValues("form_name")
    const get_email = getValues("form_email")
    const get_mobile = getValues("form_contact_no")
    const get_services = getValues("form_services")
    const get_message = getValues("form_message")

    form_validation_client(get_name,get_email,get_mobile,get_services,get_message)
    console.log("form sent sucessfully");
    


})