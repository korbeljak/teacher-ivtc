#! /usr/bin/env python3
#! python3
#! /usr/bin/python3
from copy import deepcopy
from datetime import datetime
from os.path import stat
from pathlib import Path
from shutil import make_archive
from tempfile import TemporaryDirectory
from typing import Tuple
try:
    from _ivtc import ExcelToTest
except:
    import sys
    sys.path.append(str(Path(__file__).parent.parent))
    from _ivtc import ExcelToTest


class HtmlForm:

    xlsx_db_file: Path
    variant_type: str
    variant_cnt: int
    verb_cnt: int
    output_dir: TemporaryDirectory

    def __init__(self):

        self.output_dir = TemporaryDirectory()

    def generate_variants(self):
        ett = ExcelToTest(db_file=self.xlsx_db_file,
                          variant_type=self.variant_type,
                          variant_cnt=self.variant_cnt,
                          verb_cnt=self.verb_cnt,
                          output_dir=self.output_dir)

        ett.xform()

        _, file_dt = ett.get_time_str()
        shutil.make_archive(self.output_dir,
                            'zip',
                            self.output_dir.parent,
                            f"test_{file_dt}.zip")

    def draw(self):
        pass


if __name__ == "__main__":
    # Main

    window = HtmlForm()
    window.draw()
