using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace insurance.B_Models
{
    public class ChinaDateTimeConverter : DateTimeConverterBase
    {
        private static IsoDateTimeConverter dtConverter = new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd" };

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return dtConverter.ReadJson(reader, objectType, existingValue, serializer);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            dtConverter.WriteJson(writer, value, serializer);
        }
    }

    public class _cases
    {
        public int id;
        public long? cid;
        public int? current_state;
        public int? is_reported;
        public int? is_submit;
        public int? is_investigate;
        public int? is_data_holonomic;
        public int? is_informed;
        public int? is_diffcult;
        public string diffcult_reason;
        public string data_remark;
        public string report_type;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? report_time;
        public string report_phone;
        public string application_id;
        public string policy_id;
        public string policy_type;
        public string policy_holder;
        public string insurant_name;
        public string insurant_sex;
        public string insurant_habitation;
        public int? insurant_age;
        public string insurant_idcard;
        public string insurant_phone;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? accident_time;
        public string accident_reason;
        public string accident_address;
        public string accident_details;
        public string hospital_name;
        public string hospital_type;
        public int? hospital_days;
        public int? hospital_is_two_public;
        public string transfer_bank;
        public string transfer_name;
        public string transfer_account;
        public string compensation_type;
        public double? compensation_amount;
        public string admissibility_type;
        public string subtract_type;
        public double? subtract_amount;
        public double? invoice_amount;
        public double? deductible_amount;
        public string adjustment_remark;
        public int? is_need_communication;
        public string communication_content;
        public int? communication_result;
        public string check_result;
        public string check_subtract_type;
        public double? check_subtract_amount;
        public string check_subtract_content;
        public string rejected_type;
        public string rejected_nature;
        public double? rejected_amount;
        public string rejected_reason;
        public string check_opinion;
        public string approval_result;
        public string report_user;
        public string record_user;
        public string adjust_user;
        public string check_user;
        public string approval_user;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? report_submit_time;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? record_submit_time;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? adjust_submit_time;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? check_submit_time;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? approval_submit_time;
        [JsonConverter(typeof(ChinaDateTimeConverter))]
        public DateTime? expire_date;
        public string case_source;
        public string case_type;
        public string case_type_remark;
        public string subtract_type_remark;
    }
}