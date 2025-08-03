import { useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
// import { set } from "mongoose";


function App() {

  const [msg, setmsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmaiLIst] = useState([]);
  const [subject, setSubject] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);


  function handleSubject(e) {
    setSubject(e.target.value);
  }

  function handlemsg(e) {
    setmsg(e.target.value);
  }


  function handleFile(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalEmail = emailList.map(item => item.A)
      console.log(totalEmail);
      setEmaiLIst(totalEmail);
      // You can also set the emailList to state if needed
      // setEmailList(emailList);
      // For example, if you want to display the emails in the UI:
      // console.log(emailList);
      // setEmailList(emailList.map(item => item.A)); // Assuming the emails are in column A
      // This will convert the emailList to an array of email addresses
      // Process the emailList as needed
    };
    reader.readAsArrayBuffer(file);
  }

  function send() {
    setStatus(true);
    axios.post('http://localhost:5000/sendmail', { msg: msg, emailList: emailList, subject: subject })
      .then(function (data) {
        if (data.data === true) {
          alert("Email sent successfully");
          setStatus(false);
        }
        else {
          alert("Failed to send email");
          setStatus(false);
        }
      });
  }

  return (
    <>
      <div className="text-center text-white bg-blue-950 ">
        <h1 className="px-5 py-3 text-2xl font-medium">Bulk Mail Sender</h1>
      </div>
      <div className="text-center text-white bg-blue-800">
        <h1 className="px-5 py-3 text-xl font-medium">
          We can help your business with sending multiple emails at once
        </h1>
      </div>
      <div className="text-center text-white bg-blue-600">
        <h1 className="px-5 py-3 text-xl font-medium">Drag and Drop</h1>
      </div>

      <div className="flex flex-col items-center px-5 py-3 text-black bg-blue-400">
        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={handleSubject}
          className="w-[80%] py-2 px-2 mb-4 border outline-none h-16 border-black rounded-md"
        />
      </div>

      <div className="flex flex-col items-center px-5 py-3 text-black bg-blue-400">
        <textarea onChange={handlemsg} value={msg}
          className="w-[80%] h-60 py-2 outline-none px-2 border border-black rounded-md"
          placeholder="Enter your Email text here"
          name=""
          id=""
        ></textarea>

        {/* <div>
          <input
            type="file" onChange={handleFile}
            className="px-4 py-4 mt-5 mb-5 border-4 border-dashed"
          />
        
        </div> */}

        <div className="w-full flex flex-col items-center justify-center">
          <label className="block px-7 text-gray-700 font-medium mb-1">Upload Excel File</label>

          <input
            type="file"
            id="excelUpload"
            accept=".xls,.xlsx"
            onChange={handleFile}
            className="hidden"
          />

          <label
            htmlFor="excelUpload"
            className="inline-block px-5 text-center py-2 bg-blue-700 text-white font-medium rounded-md shadow hover:bg-blue-800 cursor-pointer transition"
          >
           {selectedFile ? `📄 ${selectedFile.name}` : "📂 Choose Excel File"}
          </label>
        </div>



        <p>Total Emails in the file: {emailList.length} </p>

        <button onClick={send} className="px-2 py-2 mt-5 font-medium text-white rounded-md w-fit bg-blue-950">
          {status ? 'Sending...' : 'Send Emails'}
        </button>
      </div>
      <div className="p-8 text-center text-white bg-blue-300"></div>
      <div className="p-8 text-center text-white bg-blue-200"></div>
    </>
  );
}

export default App;