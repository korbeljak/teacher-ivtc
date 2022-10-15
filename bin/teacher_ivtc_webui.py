#!/usr/bin/python
"""

    AUTH_TYPE
    CONTENT_LENGTH
    CONTENT_TYPE
    DATE_GMT
    DATE_LOCAL
    DOCUMENT_NAME
    DOCUMENT_ROOT
    DOCUMENT_URI
    GATEWAY_INTERFACE
    LAST_MODIFIED
    PATH
    PATH_INFO
    PATH_TRANSLATED
    QUERY_STRING
    REMOTE_ADDR
    REMOTE_HOST
    REMOTE_IDENT
    REMOTE_USER
    REQUEST_METHOD
    SCRIPT_NAME
    SERVER_NAME
    SERVER_PORT
    SERVER_PROTOCOL
    SERVER_ROOT
    SERVER_SOFTWARE 

In addition, HTTP headers sent by the server may be passed in the environment as well. Here are some common variable names:

    HTTP_ACCEPT
    HTTP_CONNECTION
    HTTP_HOST
    HTTP_PRAGMA
    HTTP_REFERER
    HTTP_USER_AGENT
"""
from cgi import FieldStorage
from pathlib import Path
from string import Template
from sys import stdout
from tempfile import TemporaryDirectory
from traceback import format_exc
from zipfile import ZipFile, ZIP_LZMA


headers = []

try:
    try:
        from teacher_ivtc.ivtc import ExcelToTest
    except:
        import sys
        sys.path.append(
            str(Path(__file__).parent.parent / "src" / "teacher_ivtc"))
        from ivtc import ExcelToTest

    form = FieldStorage()

    will_generate = False
    if form.getvalue("generate", None) is not None:

        will_generate = True

        fileitem = form['database-xlsx']

        with TemporaryDirectory() as tmpd:

            # print(f"{tmpd}")

            tmpdp = Path(tmpd)
            tmpfp = tmpdp / "database.xlsx"

            with open(tmpfp, "wb") as fp:
                fp.write(fileitem.file.read())

            db_file = tmpfp
            variant_type = form.getvalue("variant-type")
            variant_cnt = int(form.getvalue("variant-count"))
            verb_cnt = int(form.getvalue("verb-count"))
            output_dir = tmpdp

            # print(
            #    f"db_file={db_file},variant_type={variant_type},variant_cnt={variant_cnt},verb_cnt={verb_cnt},output_dir={output_dir}")

            ett = ExcelToTest(db_file=db_file,
                              variant_type=variant_type,
                              variant_cnt=variant_cnt,
                              verb_cnt=verb_cnt,
                              output_dir=output_dir)
            ett.xform()

            zipfp = tmpdp / "test.zip"
            with ZipFile(zipfp, "w", compression=ZIP_LZMA) as zfp:
                for a_file in tmpdp.iterdir():
                    #print(f"{a_file}, {a_file.suffix}")
                    if a_file.suffix == ".docx":
                        zfp.write(a_file,
                                  arcname=a_file.name)

            zipfp_size = zipfp.stat().st_size

            headers.append(
                "Content-Type: application/zip, application/octet-stream")
            headers.append(
                f"Content-Disposition: inline, filename=test_{ett.get_time_str()[1]}.zip")
            headers.append(f"Content-Length: {zipfp_size}")

            for header in headers:
                print(header)
            print()

            with open(zipfp, "rb") as fp:
                stdout.flush()
                stdout.buffer.write(fp.read())
    else:
        headers.append("Content-Type: text/html;charset=utf-8;")

        with open("index.tpl.html", "r") as fp:
            html_tpl = Template(fp.read())

        for header in headers:
            print(header)
        print()

        html_str = html_tpl.safe_substitute(
            dbg_text=f"<pre>\n{form} {will_generate}</pre>")
        print(html_str)
except:

    for header in headers:
        print(header)
    print()

    html_str = f"<pre>CAUGHT EXCEPTION:\n{format_exc()}</pre>"
    print(html_str)
