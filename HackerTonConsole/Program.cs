using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.XPath;
using HtmlAgilityPack;

/*
샘플 코드 : 
http://htmlagilitypack.codeplex.com/wikipage?title=Examples
http://www.rkttu.com/660

CSV Examples :
http://j07051.tistory.com/566
*/

namespace HackerTonConsole
{
    class Program
    {
        static string[] Category = new[]
        {
            "Name",
            "Status",
            "Sex",
            "Province",
            "Area",
            "Date of death",
            "Cause of Death"
        };

        static string GetUri(int uriCount)
        {
            string uriFront =
                "http://www.vdc-sy.info/index.php/en/martyrs/";
            string uriBack = "/c29ydGJ5PWEua2lsbGVkX2RhdGV8c29ydGRpcj1ERVNDfGFwcHJvdmVkPXZpc2libGV8ZXh0cmFkaXNwbGF5PTB8";
            return uriFront + uriCount + uriBack;
        }

        static void Main(string[] args)
        {
            // 데이터 정의
            var dt = new DataTable();
            InitDataTable(Category, dt);

            // 웹크롤링 읽어오기 1 ~ 1236
            for (int uriCount = 1; uriCount <= 1236; uriCount++)
            {
                Uri targetUri = new Uri(GetUri(uriCount));

                var webRequest = HttpWebRequest.Create(targetUri) as HttpWebRequest;

                using (HttpWebResponse webResponse =
                    webRequest.GetResponse() as HttpWebResponse)
                using (Stream webResponseStream =
                    webResponse.GetResponseStream())
                {
                    var document = new HtmlDocument();
                    var targetEncoding = Encoding.UTF8;
                    document.Load(webResponseStream, targetEncoding, true);

                    int count = 0;
                    // 모든 tr 태그들을 불러온다
                    foreach (HtmlNode link in document.DocumentNode.SelectNodes("//tr"))
                    {//"//a[@href]"

                        var row = dt.NewRow();
                        // 첫 3 Row 값을 무시한다.
                        count++;
                        if (count < 3) continue;

                        Console.WriteLine(link);
                        int foreachCount = 0;
                        foreach (var attribute in link.ChildNodes)
                        {
                            var str = attribute.InnerText.Replace("\t", "");
                            str = str.Replace("\n", "");
                            Console.WriteLine(str);

                            InputValue(foreachCount, row, str);
                            foreachCount++;
                        }
                        dt.Rows.Add(row);
                        Console.WriteLine("-----------------");
                    }
                }
                
                Console.WriteLine("==================");
                Console.WriteLine($"== {uriCount} 번째 완료 ==");
                Console.WriteLine("==================");
                Thread.Sleep(1000);
            }
            
            //StreamWriter sw = new StreamWriter("Martyrs.csv");
            //WriteToStream(sw, dt, false, false);
            dt.WriteCsv("Martyrs.csv");

            dt.TableName = "Martyrs";
            dt.WriteXml("Martyrs.xml", XmlWriteMode.WriteSchema);

            DataTable dt2 = new DataTable();
            string[] sortedCategory = new[]
            {
                "Name",
                "Status",
                "Adult",
                "Sex",
                "Province",
                "Area",
                "Date of death",
                "Cause of Death"
            };

            int sortedCound = 0;
            InitDataTable(sortedCategory, dt2);
            foreach (DataRow row in dt.Rows)
            {
                // 첫번재 값은 제외
                sortedCound++;
                if (sortedCound == 1)
                    continue;

                var dt2Row = dt2.NewRow();
                foreach (var cateName in sortedCategory)
                {
                    if (cateName != "Adult" && cateName != "Sex")
                    {
                        dt2Row[cateName] = row[cateName];
                    }
                    else
                    {
                        var str = row["Sex"] as string;
                        if (str == null)
                            break;
                        if (str.Contains("Adult"))
                        {
                            dt2Row["Adult"] = "Adult";
                        }
                        else if (str.Contains("Child"))
                        {
                            dt2Row["Adult"] = "Child";
                        }
                        else
                        {
                            
                        }

                        if (str.Contains("Male"))
                        {
                            dt2Row["Sex"] = "Male";
                        }
                        else if (str.Contains("Female"))
                        {
                            dt2Row["Sex"] = "Female";
                        }
                        else
                        {
                            
                        }
                    }
                }
                dt2.Rows.Add(dt2Row);
            }

            StreamWriter sw2 = new StreamWriter("Martyrs3.csv");
            WriteToStream(sw2, dt2, false, false);
        }

        private static void InputValue(int foreachCount, DataRow row, string str)
        {
            switch (foreachCount)
            {
                case 1:
                    row[Category[0]] = str;
                    break;
                case 3:
                    row[Category[1]] = str;
                    break;
                case 5:
                    row[Category[2]] = str;
                    break;
                case 7:
                    row[Category[3]] = str;
                    break;
                case 9:
                    row[Category[4]] = str;
                    break;
                case 11:
                    row[Category[5]] = str;
                    break;
                case 13:
                    row[Category[6]] = str;
                    break;
            }
        }

        private static void InitDataTable(string[] category, DataTable dt)
        {
            foreach (var cate in category)
            {
                dt.Columns.Add(new DataColumn(cate));
            }
            // 최상이 이름 지정
            var col = dt.NewRow();
            foreach (var cate in category)
            {
                col[cate] = cate;
            }
            dt.Rows.Add(col);
        }

        public static void WriteToStream(TextWriter stream, DataTable table, bool header, bool quoteall)
        {
            if (header)
            {
                for (int i = 0; i < table.Columns.Count; i++)
                {
                    WriteItem(stream, table.Columns[i].Caption, quoteall);
                    if (i < table.Columns.Count - 1)
                        stream.Write(',');
                    else
                        stream.Write("\r\n");
                }
            }
            foreach (DataRow row in table.Rows)
            {
                for (int i = 0; i < table.Columns.Count; i++)
                {
                    WriteItem(stream, row[i], quoteall);
                    if (i < table.Columns.Count - 1)
                        stream.Write(',');
                    else
                        stream.Write("\r\n");
                }
            }
            stream.Flush();
            stream.Close();
        }

        private static void WriteItem(TextWriter stream, object item, bool quoteall)
        {
            if (item == null)
                return;
            string s = item.ToString();
            if (quoteall || s.IndexOfAny("\",\x0A\x0D".ToCharArray()) > -1)
                stream.Write("\"" + s.Replace("\"", "\"\"") + "\"");
            else
                stream.Write(s);
            stream.Flush();
        }
    }
}

