function validator(formSelector) {
    function getForm(element , seletor) {
        while (element.parentElement) {
            if(element.parentElement.matches(seletor)) {
                return element.parentElement;
            }
            else element = element.parentElement;
        }
    }
    var formRules = {};
    var validatorRules = {
        required : function(value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email : function(value) {
            var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            return regex.test(value) ? undefined : 'Email bạn nhập không hợp lệ !';
        },
        min : function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`;
            }
        }
    }
    formElement = document.querySelector(formSelector);
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs) {
            var rules = input.getAttribute('rules').split('|'); 
            var ruleInfo;
            for(var rule of rules) {
                var check = rule.includes(':');
                if(check) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                var ruleFuc = validatorRules[rule];
                if(check) ruleFuc = ruleFuc(ruleInfo[1]);
                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFuc);
                }
                else {
                    formRules[input.name] = [ruleFuc];
                }
            }
            input.onblur = checkInput;
        }
        function checkInput(event) {
            var inputFuc = formRules[event.target.name];
            var result;
            for(var Fuc of inputFuc) {
                result = Fuc(event.target.value);
            }
            // console.log(result);
            formStyle = getForm(event.target , '.form-style');
            spanElement = formStyle.querySelector('.form-message');
            if(result) {spanElement.innerText = result;
            spanElement.classList.add('red');
            formStyle.querySelector('.form-input').classList.add('error');}
            else {
                spanElement.innerText = "";
                spanElement.classList.remove('red');
                formStyle.querySelector('.form-input').classList.remove('error')
            }
            return !result;
        }

        formElement.onsubmit = function(event) {
            event.preventDefault();
            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValud = true;
            var data ={};
            for(var input of inputs) {
                if(!checkInput({target : input})) isValud = false;
            }
            if(isValud) {
                for(var input of inputs) {
                    data[input.name] = input.value;
                }
                console.log(data);
            }
        }
    }
}