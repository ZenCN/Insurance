using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using insurance.B_Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.SS.Util;

namespace insurance.Controllers
{
    public class IndexController : Controller
    {
        private HttpApplicationState app = System.Web.HttpContext.Current.Application;
        private insurance_entities db_context = new insurance_entities();
        private JsonSerializerSettings json_setting = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };

        public FileResult index()
        {
            return File("~/index.html", "text/html");
        }

        /*public string template()
        {
            string response = "";

            try
            {

            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }*/

        public string delete_user(int uid)
        {
            string response = "";

            try
            {
                lgn user = db_context.lgn.Where(t => t.uid == uid).SingleOrDefault();
                if (user != null)
                {
                    db_context.lgn.DeleteObject(user);
                    db_context.SaveChanges();
                    response = "1";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string add_user(string user_info)
        {
            string response = "";

            try
            {
                lgn user = JsonConvert.DeserializeObject<lgn>(user_info);
                db_context.lgn.AddObject(user);
                db_context.SaveChanges();
                response = "1";
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string modify_user(string user_info)
        {
            string response = "";

            try
            {
                lgn user = JsonConvert.DeserializeObject<lgn>(user_info);

                var _user = db_context.lgn.Where(t => t.uid == user.uid).SingleOrDefault();
                if (_user != null)
                {
                    _user.user_name = user.user_name;
                    _user.password = user.password;
                    _user.authority_level = user.authority_level;
                    db_context.SaveChanges();
                    response = "1";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string validate_user(string username, string password)
        {
            string response = "0";

            try
            {
                var lgn = db_context.lgn.Where(t => t.user_name == username && t.password == password).SingleOrDefault();
                if (lgn != null)
                {
                    lgn.last_login_time = DateTime.Now;
                    db_context.SaveChanges();

                    response = "{\"authority_level\":" + lgn.authority_level + ",\"field_range\":" + get_field_range() +
                               "}";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string fields_val()
        {
            string response = "";

            try
            {
                if (app["field_range"] != null)
                {
                    response = app["field_range"].ToString();
                }
                else
                {
                    response = "{";
                    foreach (field_range _this in db_context.field_range)
                    {
                        response += "\"" + _this.field_name + "\":" +
                                    JsonConvert.SerializeObject(_this.field_value.Split(new[] { "," },
                                        StringSplitOptions.RemoveEmptyEntries)) + ",";
                    }
                    response = response.Remove(response.Length - 1) + "}";
                    app["field_range"] = response;
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string cid()
        {
            string response = "";

            try
            {
                if (db_context.cases.Any())
                {
                    string cid = db_context.cases.Max(t => t.cid).ToString();
                    if (cid.Trim().Length == 12)
                    {
                        int max_cid = 0;
                        if (int.TryParse(cid.Substring(8), out max_cid) && max_cid > 0)
                        {
                            if (max_cid < 10)
                            {
                                response = "000" + (max_cid + 1);
                            }
                            else if (max_cid >= 10 && max_cid < 100)
                            {
                                response = "00" + (max_cid + 1);
                            }
                            else if (max_cid >= 100 && max_cid < 1000)
                            {
                                response = "0" + (max_cid + 1);
                            }
                            else if (max_cid >= 1000)
                            {
                                response = (max_cid + 1).ToString();
                            }
                        }
                    }
                    else
                    {
                        response = "0001";
                    }
                }
                else 
                {
                    response = "0001";
                }

                if (response.Length > 0) 
                {
                    response = DateTime.Now.ToString("yyyyMMdd") + response;
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string get_investigation(string cid)
        {
            string response = "";

            try
            {
                investigation invest = db_context.investigation.Where(t => t.cid == cid).SingleOrDefault();
                if (invest != null)
                {
                    response = JsonConvert.SerializeObject(invest, json_setting);
                }
                else
                {
                    response = "{}";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string save_case(string case_, string investigation)
        {
            string response = "";
            int authority_level = int.Parse(Request.Cookies["authority_level"].Value);

            /*try
            {*/
                if (investigation != null)
                {
                    var _investigation = JsonConvert.DeserializeObject<investigation>(investigation);
                    var old_investigation = db_context.investigation.Where(t => t.cid == _investigation.cid).SingleOrDefault();

                    var is_new = false;
                    if (old_investigation == null)
                    {
                        old_investigation = new investigation();
                        is_new = true;
                    }

                    old_investigation.cid = _investigation.cid;
                    if (authority_level >= 2)  //初录、理算
                    {
                        old_investigation.investigation_cause = _investigation.investigation_cause;
                    }
                    if (authority_level >= 4)  //审核
                    {
                        old_investigation.investigation_area = _investigation.investigation_area;
                        old_investigation.contact = _investigation.contact;
                        old_investigation.contact_phone = _investigation.contact_phone;
                        old_investigation.survey_points = _investigation.survey_points;
                    }
                    if (authority_level >= 5)  //审批
                    {
                        old_investigation.approval_result = _investigation.approval_result;
                        old_investigation.approval_remark = _investigation.approval_remark;
                    }

                    if (is_new)
                    {
                        db_context.investigation.AddObject(old_investigation);
                    }
                }

                cases _case = JsonConvert.DeserializeObject<cases>(case_);
                if (_case.id > 0) //修改
                {
                    cases old_case = db_context.cases.Where(t => t.id == _case.id).SingleOrDefault();
                    if (old_case != null)
                    {
                        old_case.current_state = _case.current_state;
                        old_case.is_submit = _case.is_submit;
                        if (authority_level >= 1)
                        {
                            old_case.is_reported = _case.is_reported;
                            old_case.report_time = _case.report_time;
                            old_case.application_id = _case.application_id;
                            old_case.policy_id = _case.policy_id;
                            old_case.report_type = _case.report_type;
                            old_case.report_phone = _case.report_phone;
                            old_case.insurant_name = _case.insurant_name;
                            old_case.insurant_age = _case.insurant_age;
                            old_case.insurant_sex = _case.insurant_sex;
                            old_case.insurant_habitation = _case.insurant_habitation;
                            old_case.insurant_idcard = _case.insurant_idcard;
                            old_case.insurant_phone = _case.insurant_phone;
                            old_case.accident_address = _case.accident_address;
                            old_case.accident_time = _case.accident_time;
                            old_case.policy_type = _case.policy_type;
                            old_case.hospital_is_two_public = _case.hospital_is_two_public;
                            old_case.hospital_name = _case.hospital_name;
                            old_case.hospital_type = _case.hospital_type;
                            old_case.case_type = _case.case_type;
                            old_case.case_type_remark = _case.case_type_remark;

                            if (old_case.report_user == null) {
                                old_case.report_user = _case.report_user;
                            }
                            if (old_case.is_submit > 0 && old_case.report_submit_time == null)
                            {
                                old_case.report_submit_time = DateTime.Now;
                            }
                        }
                        if (authority_level >= 2)
                        {
                            old_case.policy_holder = _case.policy_holder;
                            old_case.accident_reason = _case.accident_reason;
                            old_case.admissibility_type = _case.admissibility_type;
                            old_case.compensation_type = _case.compensation_type;
                            old_case.transfer_bank = _case.transfer_bank;
                            old_case.transfer_name = _case.transfer_name;
                            old_case.transfer_account = _case.transfer_account;
                            old_case.is_data_holonomic = _case.is_data_holonomic;
                            old_case.is_informed = _case.is_informed;
                            old_case.data_remark = _case.data_remark;
                            old_case.is_investigate = _case.is_investigate;
                            old_case.expire_date = _case.expire_date;
                            old_case.case_source = _case.case_source;

                            if (old_case.record_user == null)
                            {
                                old_case.record_user = _case.record_user;
                            }
                            if (old_case.is_submit > 0 && old_case.record_submit_time == null)
                            {
                                old_case.record_submit_time = DateTime.Now;
                            }
                        }
                        if (authority_level >= 3)
                        {
                            old_case.hospital_days = _case.hospital_days;
                            old_case.subtract_type = _case.subtract_type;
                            old_case.subtract_amount = _case.subtract_amount;
                            old_case.compensation_amount = _case.compensation_amount;
                            old_case.invoice_amount = _case.invoice_amount;
                            old_case.deductible_amount = _case.deductible_amount;
                            old_case.adjustment_remark = _case.adjustment_remark;
                            old_case.is_diffcult = _case.is_diffcult;
                            old_case.diffcult_reason = _case.diffcult_reason;
                            old_case.subtract_type_remark = _case.subtract_type_remark;

                            if (old_case.adjust_user == null)
                            {
                                old_case.adjust_user = _case.adjust_user;
                            }
                            if (old_case.is_submit > 0 && old_case.adjust_submit_time == null)
                            {
                                old_case.adjust_submit_time = DateTime.Now;
                            }
                        }
                        if (authority_level >= 4)
                        {
                            old_case.is_need_communication = _case.is_need_communication;
                            old_case.communication_content = _case.communication_content;
                            old_case.communication_result = _case.communication_result;
                            old_case.check_result = _case.check_result;
                            old_case.check_subtract_type = _case.check_subtract_type;
                            old_case.check_subtract_amount = _case.check_subtract_amount;
                            old_case.check_subtract_content = _case.check_subtract_content;
                            old_case.rejected_type = _case.rejected_type;
                            old_case.rejected_nature = _case.rejected_nature;
                            old_case.rejected_amount = _case.rejected_amount;
                            old_case.rejected_reason = _case.rejected_reason;
                            old_case.check_opinion = _case.check_opinion;

                            if (old_case.check_user == null)
                            {
                                old_case.check_user = _case.check_user;
                            }
                            if (old_case.is_submit > 0 && old_case.check_submit_time == null)
                            {
                                old_case.check_submit_time = DateTime.Now;
                            }
                        }
                        if (authority_level >= 5)
                        {
                            old_case.approval_result = _case.approval_result;

                            if (old_case.approval_user == null)
                            {
                                old_case.approval_user = _case.approval_user;
                            }
                            if (old_case.is_submit > 0 && old_case.approval_submit_time == null)
                            {
                                old_case.approval_submit_time = DateTime.Now;
                            }
                        }

                        db_context.SaveChanges();
                        response = _case.id.ToString();
                    }
                }
                else
                {
                    if (authority_level == 1) {
                        _case.report_submit_time = DateTime.Now;
                    }
                    db_context.cases.AddObject(_case);
                    db_context.SaveChanges();
                    response = _case.id.ToString();
                }
            /*}
            catch (Exception ex)
            {
                response = ex.Message;
            }*/

            return response;
        }

        public string self_case(int authority_level, int page_index, int page_size, string insurant_idcard, string policy_id, string insurant_name)
        {
            string response = "";

            try
            {
                if (db_context.cases.Any())
                {
                    List<_cases> list = null;
                    if (authority_level < 4)
                    {
                        list = (from t in db_context.cases
                            where t.current_state == authority_level && t.is_submit != 1
                            select new _cases()
                            {
                                cid = t.cid,
                                policy_id = t.policy_id,
                                insurant_name = t.insurant_name,
                                insurant_idcard = t.insurant_idcard,
                                accident_time = t.accident_time,
                                report_type = t.report_type,
                                is_submit = t.is_submit,
                                is_data_holonomic = t.is_data_holonomic,
                                is_informed = t.is_informed,
                                is_diffcult = t.is_diffcult,
                            }).ToList();
                    }
                    else
                    {
                        list = (from t in db_context.cases
                            where t.current_state == authority_level && t.is_submit != 1
                            select new _cases()
                            {
                                cid = t.cid,
                                is_need_communication = t.is_need_communication,
                                communication_result = t.communication_result,
                                report_time = t.report_time,
                                insurant_habitation = t.insurant_habitation,
                                insurant_name = t.insurant_name,
                                accident_time = t.accident_time,
                                is_reported = t.is_reported,
                                hospital_type = t.hospital_type,
                                deductible_amount = t.deductible_amount,
                                compensation_type = t.compensation_type,
                                invoice_amount = t.invoice_amount,
                                subtract_amount = t.subtract_amount,
                                compensation_amount = t.compensation_amount,
                                is_submit = t.is_submit,
                                is_diffcult = t.is_diffcult
                            }).ToList();
                    }

                    if (insurant_idcard != null && insurant_idcard.Trim().Length > 0)
                    {
                        list = list.Where(t => t.insurant_idcard != null && t.insurant_idcard.StartsWith(insurant_idcard)).ToList();
                    }
                    else if (policy_id != null && policy_id.Trim().Length > 0)
                    {
                        list = list.Where(t => t.policy_id != null && t.policy_id.StartsWith(policy_id)).ToList();
                    }
                    else if (insurant_name != null && insurant_name.Trim().Length > 0)
                    {
                        list = list.Where(t => t.insurant_name != null && t.insurant_name.Contains(insurant_name)).ToList();
                    }

                    int record_count = list.Count();
                    int page_count = (record_count + page_size - 1) / page_size;
                    response = "\"page_count\":" + page_count + ", \"record_count\":" + record_count + ", \"cases\":";

                    list = list.OrderByDescending(t => t.cid).Skip(page_index * page_size).Take(page_size).ToList();

                    response += JsonConvert.SerializeObject(list, json_setting);
                }
                else
                {
                    response = "\"page_count\":0, \"record_count\":0, \"cases\":[]";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
                throw ex;
            }

            return "{" + response + "}";
        }

        public string general_query(int page_index, int page_size, string insurant_idcard, string policy_id, string insurant_name)
        {
            string response = "";

            try
            {
                if (db_context.cases.Any())
                {
                    var _cases = (from t in db_context.cases
                        select new _cases()
                        {
                            cid = t.cid,
                            policy_id = t.policy_id,
                            report_time = t.report_time,
                            insurant_name = t.insurant_name,
                            insurant_idcard = t.insurant_idcard,
                            accident_time = t.accident_time,
                            is_reported = t.is_reported,
                            report_type = t.report_type,
                            hospital_type = t.hospital_type,
                            deductible_amount = t.deductible_amount,
                            compensation_type = t.compensation_type,
                            invoice_amount = t.invoice_amount,
                            subtract_amount = t.subtract_amount,
                            compensation_amount = t.compensation_amount,
                            current_state = t.current_state,
                            is_submit = t.is_submit
                        }).ToList();

                    if (insurant_idcard != null && insurant_idcard.Trim().Length > 0)
                    {
                        _cases = _cases.Where(t => t.insurant_idcard != null && t.insurant_idcard.StartsWith(insurant_idcard)).ToList();
                    }
                    else if (policy_id != null && policy_id.Trim().Length > 0)
                    {
                        _cases = _cases.Where(t => t.policy_id != null && t.policy_id.StartsWith(policy_id)).ToList();
                    }
                    else if (insurant_name != null && insurant_name.Trim().Length > 0)
                    {
                        _cases = _cases.Where(t => t.insurant_name != null && t.insurant_name.Contains(insurant_name)).ToList();
                    }

                    int record_count = _cases.Count();
                    int page_count = (record_count + page_size - 1) / page_size;
                    response = "\"page_count\":" + page_count + ", \"record_count\":" + record_count + ", \"cases\":";

                    _cases = _cases.OrderByDescending(t => t.cid).Skip(page_index * page_size).Take(page_size).ToList();

                    response += JsonConvert.SerializeObject(_cases, json_setting);
                }
                else
                {
                    response = "\"page_count\":0, \"record_count\":0, \"cases\":[]";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return "{" + response + "}";
        }

        public string inferior_cases(int authority_level, int page_index, int page_size, string insurant_idcard, string policy_id, string insurant_name)
        {
            string response = "";

            try
            {
                if (db_context.cases.Any())
                {
                    var _cases = (from t in db_context.cases
                                 where t.current_state == (authority_level - 1) && t.is_submit == 1
                        select new _cases()
                        {
                            cid = t.cid,
                            insurant_name = t.insurant_name,
                            insurant_idcard = t.insurant_idcard,
                            accident_time = t.accident_time,
                            report_type = t.report_type,
                            is_submit = t.is_submit
                        }).ToList();

                    if (insurant_idcard != null && insurant_idcard.Trim().Length > 0)
                    {
                        _cases = _cases.Where(t => t.insurant_idcard != null && t.insurant_idcard.StartsWith(insurant_idcard)).ToList();
                    }
                    else if (policy_id != null && policy_id.Trim().Length > 0)
                    {
                        _cases = _cases.Where(t => t.policy_id != null && t.policy_id.StartsWith(policy_id)).ToList();
                    }
                    else if (insurant_name != null && insurant_name.Trim().Length > 0)
                    {
                        _cases = _cases.Where(t => t.insurant_name != null && t.insurant_name.Contains(insurant_name)).ToList();
                    }

                    int record_count = _cases.Count();
                    int page_count = (record_count + page_size - 1) / page_size;
                    response = "\"page_count\":" + page_count + ", \"record_count\":" + record_count + ", \"cases\":";

                    _cases = _cases.OrderByDescending(t => t.cid).Skip(page_index * page_size).Take(page_size).ToList();

                    response += JsonConvert.SerializeObject(_cases, json_setting);
                }
                else
                {
                    response = "\"page_count\":0, \"record_count\":0, \"cases\":[]";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return "{" + response + "}";
        }

        public string modify_case(long cid)
        {
            string response = "";

            try
            {
                var _case = (from t in db_context.cases
                    where t.cid == cid
                    select new _cases()
                    {
                        id = t.id,
                        cid = t.cid,
                        current_state = t.current_state,
                        is_reported = t.is_reported,
                        is_submit = t.is_submit,
                        is_investigate = t.is_investigate,
                        is_data_holonomic = t.is_data_holonomic,
                        is_informed = t.is_informed,
                        is_diffcult = t.is_diffcult,
                        diffcult_reason = t.diffcult_reason,
                        data_remark = t.data_remark,
                        report_type = t.report_type,
                        report_time = t.report_time,
                        report_phone = t.report_phone,
                        application_id = t.application_id,
                        policy_id = t.policy_id,
                        policy_type = t.policy_type,
                        policy_holder = t.policy_holder,
                        insurant_name = t.insurant_name,
                        insurant_sex = t.insurant_sex,
                        insurant_habitation = t.insurant_habitation,
                        insurant_age = t.insurant_age,
                        insurant_idcard = t.insurant_idcard,
                        insurant_phone = t.insurant_phone,
                        accident_time = t.accident_time,
                        accident_reason = t.accident_reason,
                        accident_address = t.accident_address,
                        accident_details = t.accident_details,
                        hospital_name = t.hospital_name,
                        hospital_type = t.hospital_type,
                        hospital_days = t.hospital_days,
                        hospital_is_two_public = t.hospital_is_two_public,
                        transfer_bank = t.transfer_bank,
                        transfer_name = t.transfer_name,
                        transfer_account = t.transfer_account,
                        compensation_type = t.compensation_type,
                        compensation_amount = t.compensation_amount,
                        admissibility_type = t.admissibility_type,
                        subtract_type = t.subtract_type,
                        subtract_amount = t.subtract_amount,
                        invoice_amount = t.invoice_amount,
                        deductible_amount = t.deductible_amount,
                        adjustment_remark = t.adjustment_remark,
                        is_need_communication = t.is_need_communication,
                        communication_content = t.communication_content,
                        communication_result = t.communication_result,
                        check_result = t.check_result,
                        check_subtract_type = t.check_subtract_type,
                        check_subtract_amount = t.check_subtract_amount,
                        check_subtract_content = t.check_subtract_content,
                        rejected_type = t.rejected_type,
                        rejected_nature = t.rejected_nature,
                        rejected_amount = t.rejected_amount,
                        rejected_reason = t.rejected_reason,
                        check_opinion = t.check_opinion,
                        approval_result = t.approval_result,
                        report_user = t.report_user,
                        report_submit_time = t.report_submit_time,
                        record_user = t.record_user,
                        record_submit_time = t.record_submit_time,
                        adjust_user = t.adjust_user,
                        adjust_submit_time = t.adjust_submit_time,
                        check_user = t.check_user,
                        check_submit_time = t.check_submit_time,
                        approval_user = t.approval_user,
                        approval_submit_time = t.approval_submit_time,
                        case_source = t.case_source,
                        expire_date = t.expire_date,
                        case_type = t.case_type,
                        case_type_remark = t.case_type_remark,
                        subtract_type_remark = t.subtract_type_remark
                    }).SingleOrDefault();
                if (_case != null)
                {
                    response = JsonConvert.SerializeObject(_case, json_setting);
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string load_all_users()
        {
            string response = "";

            try
            {
                var users = (from t in db_context.lgn
                    select new user()
                    {
                        id = t.uid,
                        name = t.user_name,
                        password = t.password,
                        authority_level = t.authority_level,
                        last_login_time = t.last_login_time
                    }).ToList().OrderBy(t => t.authority_level);
                if (users.Any())
                {
                    IsoDateTimeConverter dtConverter = new IsoDateTimeConverter
                    {
                        DateTimeFormat = "yyyy年MM月dd日 HH:mm:ss"
                    };
                    response = JsonConvert.SerializeObject(users, dtConverter);
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string details_query(string start_time, string end_time, int page_index, int page_size)
        {
            string response = "";
            DateTime start = DateTime.Parse(start_time);
            DateTime end = DateTime.Parse(end_time);

            try
            {
                var _cases = (from t in db_context.cases
                             where t.report_time >= start && t.report_time <= end
                             select new _cases
                             {
                                 cid = t.cid,
                                 current_state = t.current_state,
                                 is_reported = t.is_reported,
                                 is_submit = t.is_submit,
                                 insurant_name = t.insurant_name,
                                 insurant_habitation = t.insurant_habitation,
                                 accident_time = t.accident_time,
                                 report_time = t.report_time,
                                 hospital_type = t.hospital_type,
                                 invoice_amount = t.invoice_amount,
                                 deductible_amount = t.deductible_amount,
                                 subtract_amount = t.subtract_amount,
                                 compensation_amount = t.compensation_amount,
                                 compensation_type = t.compensation_type
                             }).ToList();
                if (_cases.Any())
                {
                    int record_count = _cases.Count();
                    int page_count = (record_count + page_size - 1) / page_size;

                    response = "\"page_count\":" + page_count + ", \"record_count\":" + record_count + ", \"cases\":";

                    _cases = _cases.OrderByDescending(t => t.cid).Skip(page_index * page_size).Take(page_size).ToList();
                    
                    response += JsonConvert.SerializeObject(_cases, json_setting);
                }
                else {
                    response = "\"page_count\":0, \"record_count\":0, \"cases\":[]";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return "{" + response + "}";
        }

        public string exportdetailsqueryresults(string start_time, string end_time, string hide_cols)
        {
            string response = "";

            try
            {
                DateTime start = DateTime.Parse(start_time);
                DateTime end = DateTime.Parse(end_time);
                List<_cases> list = (from t in db_context.cases
                              where t.report_time >= start && t.report_time <= end
                              select new _cases()
                              {
                                  insurant_name = t.insurant_name,
                                  insurant_habitation = t.insurant_habitation,
                                  accident_time = t.accident_time,
                                  is_reported = t.is_reported,
                                  is_submit = t.is_submit,
                                  report_time = t.report_time,
                                  hospital_type = t.hospital_type,
                                  invoice_amount = t.invoice_amount,
                                  deductible_amount = t.deductible_amount,
                                  subtract_amount = t.subtract_amount,
                                  compensation_type = t.compensation_type,
                                  compensation_amount = t.compensation_amount,
                                  current_state = t.current_state
                              }).ToList();
                FileOperate file_oper = new FileOperate();
                response = file_oper.ExportDetailsQueryResults(start, end, list, hide_cols);
            }
            catch (Exception ex)
            {
                response = ex.Message;
                throw ex;
            }

            return response;
        }

        public string update_fields_val(string fields_info)
        {
            string response = "";

            try
            {
                List<field_range> fields = JsonConvert.DeserializeObject<List<field_range>>(fields_info);
                int result = 0;
                if (db_context.field_range.Any())
                {
                    result = db_context.ExecuteStoreCommand("delete from field_range");
                }
                else
                {
                    result = 1;
                }
                if (result > 0)
                {
                    foreach (field_range field in fields)
                    {
                        db_context.field_range.AddObject(field);
                    }
                    db_context.SaveChanges();
                    response = "1";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string get_field_range()
        {
            string response = "";

            try
            {
                if (db_context.field_range.Any())
                {
                    response = "{";
                    foreach (field_range field in db_context.field_range.ToList())
                    {
                        response += "\"" + field.field_name + "\": \"" + field.field_value + "\",";
                    }
                    response = response.Remove(response.Length - 1) + "}";
                }
                else
                {
                    response = "{}";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        public string get_user(string name, int authority_level)
        {
            string response = "";

            try
            {
                user _user = (from t in db_context.lgn
                             where t.user_name == name && t.authority_level == authority_level
                             select new user
                             {
                                 id = t.uid,
                                 name = t.user_name,
                                 password = t.password,
                                 authority_level = t.authority_level
                             }).SingleOrDefault();
                if (_user != null)
                {
                    response = JsonConvert.SerializeObject(_user, json_setting);
                }
                else {
                    response = "{}";
                }
            }
            catch (Exception ex)
            {
                response = ex.Message;
            }

            return response;
        }

        //public string details_query_result(string start_time, string end_time)
        //{
        //    string response = "";
        //    DateTime start = DateTime.Parse(start_time);
        //    DateTime end = DateTime.Parse(end_time);
        //    int[] arr = new int[] { 0, 0, 0, 0, 0, 0,0 };
        //    string sql = "select count(*) from cases where report_time >=" + start_time + " and report_time <=" + end_time + " and";
        //    try
        //    {
        //        for (int i = 0; i < arr.Length; i++) {
        //            switch (i) { 
        //                case 1:
        //                    sql += "current_state = " + (1 + 1);
        //                    response += "['报案'," + 
        //                    break;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response = ex.Message;
        //    }

        //    return response;
        //}
    }
}
