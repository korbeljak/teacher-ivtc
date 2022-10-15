#! /usr/bin/env python3
#! python3
#! /usr/bin/python3
from copy import deepcopy
from datetime import datetime
from os.path import stat
from pathlib import Path
from tkinter import filedialog as tk_fd
from tkinter import ttk
from typing import Tuple

import tkinter as tk
import tkinter.font as tk_font

try:
    from teacher_ivtc.ivtc import ExcelToTest
except:
    import sys
    sys.path.append(str(Path(__file__).parent.parent / "src" / "teacher_ivtc"))
    from ivtc import ExcelToTest


class Style:
    pad_x: int
    pad_y: int
    mar_x: int
    mar_y: int
    fonts: dict

    def __init__(self,
                 pad_x: int = 2,
                 pad_y: int = 2,
                 mar_x: int = 1,
                 mar_y: int = 1):
        self.pad_x = pad_x
        self.pad_y = pad_y
        self.mar_x = mar_x
        self.mar_y = mar_y
        self.fonts = {}

    def set_font(self,
                 cls: str="",
                 family: str="Arial",
                 size: int=10,
                 weight: str="normal",
                 slant: str="roman"):
        self.fonts[cls] = tk_font.Font(family=family,
                                       size=size,
                                       weight=weight,
                                       slant=slant)

    def get_font(self, cls=""):
        return self.fonts[cls]


class IntField(tk.Entry):

    var: tk.IntVar
    master: tk.Widget
    root: tk.Widget
    label: str

    def __init__(self,
                 master: tk.Widget,
                 label: str,
                 value: int,
                 **kwargs) -> None:
        self.master = master
        pi = master.winfo_parent()
        self.root = master._nametowidget(pi)
        self.label = label
        self.var = tk.IntVar(value=value)
        super().__init__(master, kwargs)
        self.config(textvariable=self.var)

    def draw(self, r: int=0, c: int=0) -> (int, int):

        label = tk.Label(self.master,
                         text=self.label,
                         padx=self.root.s.pad_x,
                         pady=self.root.s.pad_y,
                         font=self.root.s.get_font("regular"))
        label.grid(row=r, column=c, sticky="E")

        self.grid(row=r, column=c + 1, sticky="W")

        return (r + 1, c + 2)

    def get_value(self) -> int:
        return self.var.get()


class PickField(tk.OptionMenu):
    var: tk.StringVar
    master: tk.Widget
    root: tk.Widget
    label: str

    def __init__(self,
                 master: tk.Widget,
                 label: str,
                 picks: Tuple[str]) -> None:
        self.master = master
        pi = master.winfo_parent()
        self.root = master._nametowidget(pi)
        self.var = tk.StringVar(value=picks[0])
        self.picks = picks
        self.label = label
        super().__init__(master,
                         self.var,
                         *picks)

    def draw(self, r: int=0, c: int=0) -> (int, int):

        label = tk.Label(self.master,
                         text=self.label,
                         padx=self.root.s.pad_x,
                         pady=self.root.s.pad_y,
                         font=self.root.s.get_font("regular"))
        label.grid(row=r, column=c, sticky="E")
        self.grid(row=r, column=c + 1, sticky="W")

        return (r + 1, c + 2)

    def get_value(self) -> int:
        return self.var.get()


class OpenDialogField(tk.Entry):

    var: tk.StringVar
    master: tk.Widget
    root: tk.Widget
    label: str
    last_dir: Path

    def __init__(self,
                 master: tk.Widget,
                 label: str,
                 value: str,
                 is_file: bool=True,
                 **kwargs) -> None:
        self.master = master
        pi = master.winfo_parent()
        self.root = master._nametowidget(pi)
        self.label = label
        self.var = tk.StringVar(value=value)
        self.last_dir = Path.cwd()
        self.last_filename = None
        if not is_file:
            self.last_filename = self.last_dir
        self.is_file = is_file
        super().__init__(master, kwargs)
        self.config(textvariable=self.var)

    def open_file(self):
        filetypes = [('Database Files', '*.xlsx')]

        filename = \
            tk_fd.askopenfilename(title='Open a database .xlsx file',
                                  initialdir=self.last_dir,
                                  filetypes=filetypes)
        filename_path = Path(filename)

        if filename_path.is_file():
            self.last_filename = filename_path
            self.last_dir = self.last_filename.parent
            self.var.set(str(self.last_filename))
        else:
            tk.messagebox.showerror(title="Error",
                                    message="Database file invalid")

    def open_dir(self):
        dirname = \
            tk_fd.askdirectory(title='Select output directory',
                               initialdir=self.last_dir)
        dirname_path = Path(dirname)

        if dirname_path.is_dir():
            self.last_filename = dirname_path
            self.last_dir = self.last_filename.parent
            self.var.set(str(self.last_filename))
        else:
            tk.messagebox.showerror(title="Error",
                                    message="Output folder invalid")

    def btn_click(self):

        if self.is_file:
            self.open_file()
        else:
            self.open_dir()

    def draw(self, r: int=0, c: int=0) -> (int, int):

        label = tk.Label(self.master,
                         text=self.label,
                         padx=self.root.s.pad_x,
                         pady=self.root.s.pad_y,
                         font=self.root.s.get_font("regular"))

        btn = tk.Button(self.master, text="Open", command=self.btn_click)

        label.grid(row=r,
                   column=c,
                   columnspan=2,
                   sticky="W")
        self.grid(row=r + 1, column=c,
                  sticky="E")
        btn.grid(row=r + 1, column=c + 1, sticky="W")

        return (r + 2, c + 2)

    def get_value(self):
        return self.last_filename


class IrregularVerbs(tk.Tk):

    xlsx_db_file_fld: OpenDialogField

    output_dir_fld: OpenDialogField

    variant_cnt_fld: IntField

    verb_cnt_fld: IntField

    variant_type_fld: PickField

    s: Style

    def __init__(self):
        super().__init__()

        self.s = Style()
        self.s.set_font("regular")

        self.main_frame = tk.Frame(self)

        self.xlsx_db_file_fld = OpenDialogField(self.main_frame,
                                                label="Database (.xlsx)",
                                                value="",
                                                width=20)

        self.output_dir_fld = OpenDialogField(self.main_frame,
                                              label="Output folder",
                                              value=str(Path.cwd()),
                                              is_file=False,
                                              width=20)

        self.variant_type_fld = PickField(self.main_frame,
                                          label="Variant Type",
                                          picks=(
                                              "Animals", "Numbers", "Letters"))

        self.variant_cnt_fld = IntField(self.main_frame,
                                        label="Variant Count",
                                        value=2,
                                        width=20)

        self.verb_cnt_fld = IntField(self.main_frame,
                                     label="Verb Count",
                                     value=5,
                                     width=20)

        self.generate_btn = tk.Button(self.main_frame,
                                      text="Generate",
                                      command=self.generate_variants)

    def generate_variants(self):
        ett = ExcelToTest(db_file=self.xlsx_db_file_fld.get_value(),
                          variant_type=self.variant_type_fld.get_value(),
                          variant_cnt=self.variant_cnt_fld.get_value(),
                          db_val_row_cnt=self.verb_cnt_fld.get_value(),
                          output_dir=self.output_dir_fld.get_value())

        ett.xform()

    def draw(self):
        r = 0
        r, _ = self.xlsx_db_file_fld.draw(r, 0)
        r, _ = self.output_dir_fld.draw(r, 0)
        r, _ = self.variant_type_fld.draw(r, 0)
        r, _ = self.variant_cnt_fld.draw(r, 0)
        r, _ = self.verb_cnt_fld.draw(r, 0)
        self.generate_btn.grid(row=r,
                               column=0,
                               columnspan=2,
                               sticky="EW")

        self.main_frame.grid(sticky="NW")

        self.geometry("400x240")

        return (r, 2)


if __name__ == "__main__":
    # Main

    window = IrregularVerbs()
    window.draw()
    window.mainloop()
