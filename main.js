function solutions(options) {
    var listRules = {};
    var isSuccess = true;
   var form = document.querySelector(options.form);
   console.log(form);
   function solve(rule , inputElement , spanElement) {
        var rules  = listRules[rule.selector];
        var errorMessage;
        for(var i = 0  ;  i < rules.length ; ++i) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](form.querySelector(rule.selector + ':checked'));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            // console.log(form.querySelector(rule.selector + ':checked'));
             if(errorMessage) break;
        }

        if(errorMessage) {
            spanElement.innerText = errorMessage;
            spanElement.classList.add('red');
            inputElement.classList.add('error');
        }


        return !errorMessage;
   }
   if(form) {



        options.rules.forEach(function(rule) {
            if(Array.isArray(listRules[rule.selector])) {
             listRules[rule.selector].push(rule.test);
            }
            else {
                listRules[rule.selector] = [rule.test];
            }   
        }) 



        options.rules.forEach(function (rule) {
                var inputElements = form.querySelectorAll(rule.selector);
                var spanElement = form.querySelector(rule.span);
                Array.from(inputElements).forEach(function (inputElement) {
                    inputElement.onblur = function(){
                    solve(rule , inputElement , spanElement);
                }
                inputElement.oninput = function() {
                    spanElement.classList.remove('red');
                    inputElement.classList.remove('error');
                    spanElement.innerText = '';
                }
            })
        })

        form.onsubmit = function(e) {
            e.preventDefault();

            var listInputs = form.querySelectorAll('[name]');   
            var listValues = Array.from(listInputs).reduce(function(values, element) {
                    switch(element.type) {
                        case 'radio':
                            if(form.querySelector(`[name = "${element.name}"]:checked`))
                            values[element.name] = form.querySelector(`[name = "${element.name}"]:checked`).value;
                            else values[element.name] ='';
                            break;
                        case 'checkbox':
                            if(!element.checked) {
                                if(!values[element.name]) values[element.name] = "";
                                return values;
                            }
                            else {
                                if(!Array.isArray(values[element.name])) values[element.name] =[element.value];
                                else {
                                    values[element.name].push(element.value);
                                }
                            }
                            break;
                        case 'file':
                            values[element.name] = element.files;
                            break;
                        default: 
                            values[element.name] = element.value;
                    }
                    return values;
            },{}) || "";

             options.rules.forEach(function(rule) {
                var inputElement = form.querySelector(rule.selector);
                var spanElement = form.querySelector(rule.span);
                var kt =solve(rule , inputElement , spanElement);
                if(!kt) isSuccess = false;
            })

            if(isSuccess) {
                if(typeof(options.onsubmit) === 'function')  options.onsubmit(listValues);
                else form.submit();
            }
        }     
    }
}  


solutions.isRequired = function(selector , span) {
    return {
        selector: selector,
        span : span,
        test : function(value) {
            return value ? undefined : 'Bạn chưa nhập vào trường này !'
        }
    }
}


solutions.isEmail = function(selector , span) {
    return {
        selector : selector,
        span : span,
        test : function(value) {
            var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            return regex.test(value) ? undefined : 'Email bạn nhập không hợp lệ !';
        }
    }
}



solutions.isPassWord = function(selector , span , min) {
    return {
        selector: selector,
        span : span,
        test : function(value) {
            return value.length >= min ? undefined : `Nhập tối thiểu ${min} kí tự !`;
        }
    }
}


solutions.passWordConfirm = function(selector , span , password , message , action) {
    return {
        selector : selector,
        span : span,
        test  : function(value) {
            if(value === password()) {
                action();
                return undefined;
            }
            else return message || 'Mật khẩu không khớp';
        }

    }
}



solutions.isCheckAgain = function(selector , span, password , action) {
    return {
        selector : selector,
        span : span,
        test : function(value) {
            if(value === password()) {
                action();
                return undefined;
            }
            else return 'Nhập mật khẩu không khớp !'
        }
    }
}