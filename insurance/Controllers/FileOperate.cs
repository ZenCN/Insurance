using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using insurance.B_Models;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;

namespace insurance.Controllers
{
    public class FileOperate
    {
        public string ExportDetailsQueryResults(DateTime start_time, DateTime end_time, List<_cases> _cases, string hide_cols)
        {
            string response = "";
            HSSFWorkbook hssfworkbook;
            using (FileStream file = new FileStream(System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "model/details_query.xls", FileMode.Open, FileAccess.Read))
            {
                hssfworkbook = new HSSFWorkbook(file);
            }

            ISheet sheet = hssfworkbook.GetSheet("案件");
            int strat_row = 2;
            sheet = CreateCell(sheet, _cases.Count(), 12, strat_row);

            ICell cell = null;
            ICellStyle cell_style = SetCellStyle(sheet);
            for (int i = 0; i < _cases.Count(); i++)
            {
                cell = sheet.GetRow(strat_row + i).GetCell(0);
                cell.SetCellValue(i + 1);
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(1);
                cell.SetCellValue(console(_cases[i].insurant_name));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(2);
                cell.SetCellValue(console(_cases[i].insurant_habitation));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(3);
                cell.SetCellValue(console(_cases[i].accident_time, "time"));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(4);
                cell.SetCellValue(_cases[i].is_reported > 0 ? "是" : "否");
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(5);
                cell.SetCellValue(console(_cases[i].report_time, "time"));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(6);
                cell.SetCellValue(console(_cases[i].hospital_type));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(7);
                cell.SetCellValue(console(_cases[i].invoice_amount, "double"));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(8);
                cell.SetCellValue(console(_cases[i].deductible_amount, "double"));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(9);
                cell.SetCellValue(console(_cases[i].subtract_amount, "double"));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(10);
                cell.SetCellValue(console(_cases[i].compensation_type));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(11);
                cell.SetCellValue(console(_cases[i].compensation_amount, "double"));
                cell.CellStyle = cell_style;

                cell = sheet.GetRow(strat_row + i).GetCell(12);
                cell.SetCellValue(QueryName("current_state", _cases[i].current_state, _cases[i].is_submit));
                cell.CellStyle = cell_style;
            }

            if (hide_cols != "none")
            {
                string[] cols = hide_cols.Split(new string[] {","}, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < cols.Length; i++)
                {
                    sheet.SetColumnHidden(int.Parse(cols[i]), true);
                }
            }

            response = ResponseExcel(hssfworkbook, start_time, end_time);

            return response;
        }

        public string console(object obj)
        {
            if (obj == null)
            {
                return "";
            }
            else
            {
                return obj.ToString();
            }
        }

        public string console(object obj, string type)
        {
            if (obj == null)
            {
                return "";
            }
            else
            {
                switch (type)
                {
                    case "time":
                        return DateTime.Parse(obj.ToString()).ToString("yyyy年MM月dd日");
                    case "double":
                        return Double.Parse(obj.ToString()).ToString("0.00");
                    default:
                        return obj.ToString();
                }
            }
        }

        public string QueryName(string field_name, int? field_val, int? is_submit)
        {
            switch (field_name)
            {
                case "current_state":
                    if (is_submit > 0)
                    {
                        field_val++;
                    }
                    switch (field_val)
                    {
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
                            return "已结案";
                    }
                default:
                    return "未知";
            }
        }

        public ISheet CreateCell(ISheet sheet, int row_count, int col_count, int start_row)
        {
            for (int i = 0; i <= row_count; i++)
            {
                IRow row = null;
                if (sheet.GetRow(start_row + i) == null)
                {
                    row = sheet.CreateRow(start_row + i);
                }
                else
                {
                    row = sheet.GetRow(start_row + i);
                }
                for (int j = 0; j <= col_count; j++)
                {
                    if (row.GetCell(j) == null)
                    {
                        row.CreateCell(j);
                    }
                }
            }

            return sheet;
        }

        private ICellStyle SetCellStyle(ISheet sheet)
        {
            ICellStyle style = sheet.Workbook.CreateCellStyle();
            style.Alignment = HorizontalAlignment.Center;//水平对齐居中
            style.BorderBottom = BorderStyle.Thin; //边框是黑色的
            style.BorderLeft = BorderStyle.Thin;
            style.BorderRight = BorderStyle.Thin;
            style.BorderTop = BorderStyle.Thin;
            return style;
        }

        public string ResponseExcel(HSSFWorkbook hssfworkbook, DateTime strat_time, DateTime end_time)
        {
            string result = "";
            // 设置响应头（文件名和文件格式）
            //设置响应的类型为Excel
            HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
            //设置下载的Excel文件名
            HttpContext.Current.Response.AddHeader("Content-Disposition",
                string.Format("attachment; filename={0}", strat_time.ToString("yyyy年M月d日") + "至" + end_time.ToString("M月d日") + ".xls"));
            //Clear方法删除所有缓存中的HTML输出。但此方法只删除Response显示输入信息，不删除Response头信息。以免影响导出数据的完整性。
            HttpContext.Current.Response.Clear();
            
            //写入到客户端
            using (MemoryStream ms = new MemoryStream())
            {
                //将工作簿的内容放到内存流中
                hssfworkbook.Write(ms);
                //将内存流转换成字节数组发送到客户端
                HttpContext.Current.Response.BinaryWrite(ms.GetBuffer());
                //HttpContext.Current.ApplicationInstance.CompleteRequest();//为了解决Response.End()由于代码已经过优化或者本机框架位于调用堆栈之上，无法计算表达式的值 的异常
                HttpContext.Current.Response.End();
                result = "下载成功！";
            }
            return result;
        }


    }
}