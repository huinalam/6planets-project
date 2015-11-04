using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HackerTonConsole.Modules
{
    public static class CsvConverter
    {
        // http://www.vdc-sy.info/index.php/en/about
        // 정보 분석

        static string[] Category = new[]
        {
            "start",
            "end",
            "label",
            "description",
        };

        //suicide attack db
        public static void Convert_SuicideAttackDb()
        {
            string[] attackCategory = new[]
            {
                "Attack Date",
                "Location",
                "Campaign",
                "Group",
                "Weapon",
                "Target",
                "Target type",
            };
            // Attack Date, Location, Campaign, Group, Weapon, Target, Target type
            var dt = new DataTable();
            dt.ReadCsv(@"origin\suicide_attack_db_2011-2015.06.csv");

            // start, end, label, description
            var makeDt = new DataTable();
            makeDt.SetColumns(Category);

            // 첫번재 값 제외
            foreach (DataRow row in dt.Rows)
            {
                var makeRow = makeDt.NewRow();
                makeRow[Category[0]] = row[attackCategory[0]];
                makeRow[Category[1]] = row[attackCategory[0]];
                makeRow[Category[2]] = row[attackCategory[1]];
                makeRow[Category[3]] = row[attackCategory[1]];
                makeDt.Rows.Add(makeRow);
            }
            makeDt.WriteCsv(@"visual\visual_suicde_attack_db.csv");
        }

        public static void Convert_external()
        {
            // 시작 날짜,종료 날짜,사건 이름,설명,지역,위도,경도,행정구역,Refenence Link,올린사람,비고
            var dt = new DataTable();
            dt.ReadCsv(@"origin\external.csv");

            // start, end, label, description
            var makeDt = new DataTable();
            makeDt.SetColumns(Category);


            // 첫번재 값 제외
            foreach (DataRow row in dt.Rows)
            {
                var makeRow = makeDt.NewRow();
                makeRow[Category[0]] = row[0];
                makeRow[Category[1]] = row[0];
                makeRow[Category[2]] = row[2];
                makeRow[Category[3]] = row[3];
                makeDt.Rows.Add(makeRow);
            }
            makeDt.WriteCsv(@"visual\visual_external.csv");
        }

        public static void Convert_internal_warxlsx()
        {
            // 시작 날짜,종료 날짜,사건 이름,설명,지역,위도,경도,행정구역,Refenence Link,올린사람,비고
            var dt = new DataTable();
            dt.ReadCsv(@"origin\internal_warxlsx.csv");

            // start, end, label, description
            var makeDt = new DataTable();
            makeDt.SetColumns(Category);


            // 첫번재 값 제외
            foreach (DataRow row in dt.Rows)
            {
                var makeRow = makeDt.NewRow();
                makeRow[Category[0]] = row[0];
                makeRow[Category[1]] = row[0];
                makeRow[Category[2]] = row[2];
                makeRow[Category[3]] = row[3];
                makeDt.Rows.Add(makeRow);
            }
            makeDt.WriteCsv(@"visual\visual_internal_warxlsx.csv");
        }

        public static void Convert_peace()
        {
            // 시작 날짜,종료 날짜,사건 이름,설명,지역,위도,경도,행정구역,Refenence Link,올린사람,비고
            var dt = new DataTable();
            dt.ReadCsv(@"origin\peace.csv");

            // start, end, label, description
            var makeDt = new DataTable();
            makeDt.SetColumns(Category);


            // 첫번재 값 제외
            foreach (DataRow row in dt.Rows)
            {
                var makeRow = makeDt.NewRow();
                makeRow[Category[0]] = row[0];
                makeRow[Category[1]] = row[0];
                makeRow[Category[2]] = row[2];
                makeRow[Category[3]] = row[3];
                makeDt.Rows.Add(makeRow);
            }
            makeDt.WriteCsv(@"visual\visual_peace.csv");
        }

        public static void Merge()
        {
            var dt1 = new DataTable();
            dt1.ReadCsv(@"visual\visual_internal_warxlsx.csv");
            var dt2 = new DataTable();
            dt2.ReadCsv(@"visual\visual_external.csv");
            var dt3 = new DataTable();
            dt3.ReadCsv(@"visual\visual_suicde_attack_db.csv");
            var dt4 = new DataTable();
            dt4.ReadCsv(@"visual\visual_peace.csv");

            var mergedDt = new DataTable();
            foreach (DataColumn column in dt1.Columns)
            {
                mergedDt.Columns.Add(new DataColumn(column.ColumnName));
            }

            foreach (DataRow row in dt1.Rows)
            {
                var newRow = mergedDt.NewRow();
                newRow[0] = Convert.ToDateTime(row[0]).ToString("yyyy-MM-dd");
                //newRow[1] = Convert.ToDateTime(row[1]).ToString("yyyy-MM-dd");
                newRow[2] = row[2];
                newRow[3] = row[3];
                mergedDt.Rows.Add(newRow);
            }
            foreach (DataRow row in dt2.Rows)
            {
                var newRow = mergedDt.NewRow();
                newRow[0] = Convert.ToDateTime(row[0]).ToString("yyyy-MM-dd");
                //newRow[1] = Convert.ToDateTime(row[1]).ToString("yyyy-MM-dd");
                newRow[2] = row[2];
                newRow[3] = row[3];
                mergedDt.Rows.Add(newRow);
            }
            foreach (DataRow row in dt3.Rows)
            {
                var newRow = mergedDt.NewRow();
                newRow[0] = Convert.ToDateTime(row[0]).ToString("yyyy-MM-dd");
                //newRow[1] = Convert.ToDateTime(row[1]).ToString("yyyy-MM-dd");
                newRow[2] = row[2];
                newRow[3] = row[3];
                mergedDt.Rows.Add(newRow);
            }
            foreach (DataRow row in dt4.Rows)
            {
                var newRow = mergedDt.NewRow();
                newRow[0] = Convert.ToDateTime(row[0]).ToString("yyyy-MM-dd");
                //newRow[1] = Convert.ToDateTime(row[1]).ToString("yyyy-MM-dd");
                newRow[2] = row[2];
                newRow[3] = row[3];
                mergedDt.Rows.Add(newRow);
            }

            IEnumerable<DataRow> query = mergedDt.AsEnumerable().OrderBy(q => q[0]);
            // Create a table from the query.
            DataTable boundTable = query.CopyToDataTable<DataRow>();

            boundTable.WriteCsv(@"visual\result.csv");
        }

        public static void Convert_MartyrsAnalysis()
        {
            var originDt = new DataTable();
            originDt.ReadXml(@"origin\Martyrs.xml");

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
            dt2.SetColumns(sortedCategory);
            foreach (DataRow row in originDt.Rows)
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

            dt2.WriteCsv(@"visual\Martyrs.csv");
        }

        public static void Convert_Martyrs()
        {
            var orgin = new DataTable();
            orgin.ReadCsv(@"visual\Martyrs3.csv");

            //var deathClassfy = orgin.AsEnumerable().GroupBy(q => q[7]);

            //Console.WriteLine("Classfy Death");
            //foreach (var death in deathClassfy)
            //{
            //    Console.WriteLine($"death.Key : {death.Key}, death.Count : {death.Count()}");
            //}
            //Console.WriteLine($"Total : {orgin.Rows.Count}");
            //Console.WriteLine("end");

            // start, end, label, description
            var makeDt = new DataTable();
            makeDt.SetColumns(Category);

            //start: 해당 달에 밝혀진 사망자 수
            //label : 전체 사망자 수
            //description : 전체 사망자 수

            // 월별로 정리
            // 모든 Day를 1로 정의
            foreach (DataRow row in orgin.Rows)
            {
                try
                {
                    DateTime date = Convert.ToDateTime(row[6]);
                    // .ToString("yyyy-MM-dd")
                    var day = date.Day;
                    if (day > 1)
                    {
                        var sub = 1 - day;
                        date = date.AddDays(sub);
                    }
                    row[6] = date.ToString("yyyy-MM-dd");
                }
                catch (Exception)
                {

                }
            }
            orgin.WriteCsv(@"visual\Martyrs5.csv");
            Debug.WriteLine("end");

            // groupby를 통하 합침.
            // 이를 날짜별로 정리
            var dateClassfy = orgin.AsEnumerable().GroupBy(q => q[6]).OrderBy(q => q.Key);

            var makeDt2 = new DataTable();
            makeDt2.SetColumns(new string[] { "date", "num" });

            // 월별 사망자수
            foreach (var dateData in dateClassfy)
            {
                var row = makeDt2.NewRow();
                row[0] = dateData.Key;
                row[1] = dateData.Count();
                makeDt2.Rows.Add(row);
            }
            makeDt2.WriteCsv(@"visual\MartyrsCount.csv");

            // 월별 사망자 누적수
            makeDt2.Rows.Clear();
            int count = 0;
            foreach (var dateData in dateClassfy)
            {
                var row = makeDt2.NewRow();
                row[0] = dateData.Key;
                count += dateData.Count();
                row[1] = count;
                makeDt2.Rows.Add(row);
            }
            makeDt2.WriteCsv(@"visual\MartyrsCount2.csv");

            Debug.WriteLine("end");
        }

        public static void Converter_Classify()
        {
            var orgin = new DataTable();
            orgin.ReadCsv(@"visual\Martyrs3.csv");

            // 매 달마다 사망자수
            var deathClassfy = orgin.AsEnumerable().GroupBy(q => q[4]);

            List<string> deathListh = new List<string>();
            Console.WriteLine("Classfy Death");
            foreach (var death in deathClassfy)
            {
                Console.WriteLine($"Area.Key : {death.Key}, Area.Count : {death.Count()}");

                deathListh.Add(death.Key.ToString());
            }
            string str = String.Empty;
            foreach (var death in deathListh)
            {
                str += death + ",";
            }
            Console.WriteLine($"Total : {orgin.Rows.Count}");
            Console.WriteLine($"Classify Count : {deathClassfy.Count()}");
            Console.WriteLine("end");
            var makeDt = new DataTable();
            makeDt.SetColumns(Category);

            //start: 해당 달에 밝혀진 사망자 수
            //label : 전체 사망자 수
            //description : 전체 사망자 수

            // 월별로 정리
            // 모든 Day를 1로 정의
            foreach (DataRow row in orgin.Rows)
            {
                try
                {
                    DateTime date = Convert.ToDateTime(row[6]);
                    // .ToString("yyyy-MM-dd")
                    var day = date.Day;
                    if (day > 1)
                    {
                        var sub = 1 - day;
                        date = date.AddDays(sub);
                    }
                    row[6] = date.ToString("yyyy-MM-dd");
                }
                catch (Exception)
                {

                }
            }
            //orgin.WriteCsv(@"visual\Martyrs5.csv");
            Debug.WriteLine("end");

            // groupby를 통하 합침.
            // 이를 날짜별로 정리
            var dateClassfy = orgin.AsEnumerable().GroupBy(q => q[6]).OrderBy(q => q.Key);

            //foreach (var dateData in dateClassfy)
            //{
            //    var deathClassify = dateData.GroupBy(q => q[7]);
            //}

            // 사망 지역
            var makeDt3 = new DataTable();
            makeDt3.SetColumns(new string[]
            {
                "date",
                "total_count",
                "Hama",
                "Damascus Suburbs","Damascus",
                "Daraa","Deir Ezzor",
                "Idlib",
                "Aleppo",
                "Homs",
                "Lattakia",
                "Quneitra",
                "Other",
                "Hasakeh",
                "Raqqa",
                "Tartous",
                "Sweida"
            });
            foreach (var dateData in dateClassfy)
            {
                var row = makeDt3.NewRow();
                row[0] = dateData.Key;
                row[1] = dateData.Count();

                var deathClassify = dateData.GroupBy(q => q[4]);
                foreach (var classify in deathClassify)
                {
                    string name = classify.Key.ToString();
                    if (String.IsNullOrEmpty(name) == false)
                    {
                        if (String.IsNullOrEmpty(name))
                        {

                        }
                        else
                        {
                            int rowCount = 0;
                            int.TryParse(row[name] as string, out rowCount);
                            row[name] = rowCount + classify.Count();
                        }
                    }
                }

                makeDt3.Rows.Add(row);
            }
            makeDt3.WriteCsv(@"visual\MartyrsProvince.csv");

            // 사망자 원인
            var makeDt2 = new DataTable();
            makeDt2.SetColumns(new string[]
            {
                "date",
                "total_count",
                "Shooting",
                //"Warplane shelling",
                //"Detention - Torture",
                //"Kidnapping - Execution",
                "Shelling",
                "Other",
                "Field Execution",
                "Explosion",
                //"Detention - Execution",
                //"Detention - Torture - Execution",
                //"Kidnapping - Torture",
                "Un-allowed to seek Medical help",
                //"Kidnapping - Torture - Execution",
                "Chemical and toxic gases",
                "Kidnapping-Detention",
            });

            // 월별 사망자수
            foreach (var dateData in dateClassfy)
            {
                var row = makeDt2.NewRow();
                row[0] = dateData.Key;
                row[1] = dateData.Count();

                var deathClassify = dateData.GroupBy(q => q[7]);
                foreach (var classify in deathClassify)
                {
                    string name = classify.Key.ToString();
                    if (String.IsNullOrEmpty(name) == false)
                    {
                        if (name == "Warplane shelling")
                            name = "Shelling";
                        if (name.Contains("Kidnapping"))
                            name = "Kidnapping-Detention";
                        if (name.Contains("Detention"))
                            name = "Kidnapping-Detention";
                        
                        int rowCount = 0;
                        int.TryParse(row[name] as string, out rowCount);
                        row[name] = rowCount + classify.Count();
                    }
                }

                makeDt2.Rows.Add(row);
            }
            makeDt2.WriteCsv(@"visual\MartyrsDeathCount.csv");

            // 월별 사망자 누적수
            makeDt2.Rows.Clear();
            int count = 0;
            foreach (var dateData in dateClassfy)
            {
                var row = makeDt2.NewRow();
                row[0] = dateData.Key;
                count += dateData.Count();
                row[1] = count;
                makeDt2.Rows.Add(row);
            }
            makeDt2.WriteCsv(@"visual\MartyrsDeathCount2.csv");

            Debug.WriteLine("end");
        }
    }
}