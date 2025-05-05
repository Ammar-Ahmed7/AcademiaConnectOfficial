const savePDFToDatabase = async () => {
  setSavingToDb(true);
  month = 0;
  year = 2024;
  Sender = 0;

  try {
    const { data: existingReport, error: fetchError } = await supabase
      .from("SendedReports")
      .select("*")
      .eq("Month", month)
      .eq("Year", year)
      .eq("Sender", Sender)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (existingReport) {
      throw new Error(
        "A report for this month/year is alredy sended to the admin"
      );
    }
    const { zip, currentDate } = await generateZip();
    const pdfBlob = pdf.output("blob");
    const timestamp = new Date().getTime();
    const fileName = `Report${Sender}_${month}_${year}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("zipreports")
      .upload(fileName, pdfBlob);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("zipreports")
      .getPublicUrl(fileName);
    // if (urlError || !urlData?.publicUrl) {
    //   throw new Error("Could not get public URL of uploaded file");
    // }

    const publicUrl = urlData?.publicUrl || "";

    const { error: dbError } = await supabase.from("SendedReports").insert({
      Month: month.toString(), // Match your text column type
      Year: parseInt(year), // Match your int8 column type
      Sender: Sender,
      FileName: fileName,
      created_at: new Date().toISOString(),
      FilePath: publicUrl,
    });

    if (dbError) throw dbError;

    showAlert("Report successfully send  toAdmin", "success");
  } catch (err) {
    console.error("Error in sending report and ", err);
    showAlert("Error in sending report " + err.message, "error");
  } finally {
    setSavingToDb(false);
  }
};
