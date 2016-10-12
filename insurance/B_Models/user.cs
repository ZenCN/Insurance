using System;

namespace insurance.B_Models
{
    public class user
    {
        public int id;

        public string name;

        public string password;

        public int? authority_level;

        public string role
        {
            get
            {
                switch (authority_level)
                {
                    case 0:
                        return "管理员";
                    case 1:
                        return "报案";
                    case 2:
                        return "初录";
                    case 3:
                        return "理算";
                    case 4:
                        return "审核";
                    case 5:
                        return "审批";
                    default:
                        return "未知";
                }
            }
        }

        public DateTime? last_login_time;
    }
}