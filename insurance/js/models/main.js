window.app = angular.module('app');
app.models = app.models || {};

app.models._case = function(config) {
    return $.extend({
        id: undefined,
        cid: undefined,
        current_state: undefined,
        is_reported: 1,
        is_submit: 0,
        is_investigate: 0,
        is_data_holonomic: 1,
        is_informed: 0,
        is_diffcult: 0,
        diffcult_reason: undefined,
        data_remark: undefined,
        report_type: "",
        report_time: undefined,
        report_phone: undefined,
        application_id: undefined,
        policy_id: undefined,
        policy_type: "",
        policy_holder: undefined,
        insurant_name: undefined,
        insurant_sex: undefined,
        insurant_habitation: undefined,
        insurant_age: undefined,
        insurant_idcard: undefined,
        insurant_phone: undefined,
        accident_time: undefined,
        accident_reason: undefined,
        accident_address: undefined,
        accident_details: undefined,
        hospital_name: "",
        hospital_type: "",
        hospital_days: undefined,
        hospital_is_two_public: 1,
        transfer_bank: undefined,
        transfer_name: undefined,
        transfer_account: undefined,
        compensation_type: "",
        compensation_amount: undefined,
        admissibility_type: "",  //受理类型
        subtract_type: "",
        subtract_amount: undefined,
        invoice_amount: undefined,
        deductible_amount: undefined,
        adjustment_remark: undefined,
        is_need_communication: 0,
        communication_content: undefined,
        communication_result: 0,    //沟通结果，0：未沟通、1：正在沟通、2：沟通通过
        check_result: undefined,
        check_subtract_type: undefined,
        check_subtract_amount: undefined,
        check_subtract_content: undefined,
        rejected_type: undefined,
        rejected_nature: undefined,
        rejected_amount: undefined,
        rejected_reason: undefined,
        check_opinion: undefined,
        approval_result: undefined,
        report_user: undefined,
        record_user: undefined,
        adjust_user: undefined,
        check_user: undefined,
        approval_user: undefined,
        report_submit_time: undefined,
        record_submit_time: undefined,
        adjust_submit_time: undefined,
        check_submit_time: undefined,
        approval_submit_time: undefined,
        expire_date: undefined,
        case_source: undefined,
        case_type: undefined,
        case_type_remark: undefined,
        subtract_type_remark: undefined
    }, config);
};

app.models.investigation = function (config) {
    return $.extend({
        id: undefined,
        cid: undefined,
        investigation_cause: undefined,
        investigation_area: undefined,
        contact: undefined,
        contact_phone: undefined,
        survey_points: undefined,
        approval_result: undefined,
        approval_remark: undefined
    }, config);
};

app.models.claims_rejected = function() {
    return {
        id: undefined,
        cid: undefined,
        rejected_type: undefined,
        rejected_nature: undefined,
        rejected_reason: undefined,
        rejected_amount: undefined
    };
};

app.models.lgn = function() {
    return {
        uid: undefined,
        user_name: undefined,
        password: undefined,
        authority_level: undefined
    };
};

app.models.search = function() {
    return {
        condition: {
            cid: undefined,
            insurant: {
                idcard: undefined,
                name: undefined
            }
        },
        page: {
            count: 10,
            index: undefined,
            content: []
        },
        search: {
            selected: undefined,
            filter: [],
            all_cases: []
        }
    }
};