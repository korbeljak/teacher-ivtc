from setuptools import setup, find_packages

VERSION = '0.0.4'
DESCRIPTION = 'Irregular Verbs Test Creator'
LONG_DESCRIPTION = 'Irregular Verbs Test Creator'

# Setting up
setup(
    # the name must match the folder name 'verysimplemodule'
    name="teacher-ivtc",
    version=VERSION,
    author="Jakub Korbel",
    author_email="<korbel.jak@gmail.com>",
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    package_dir={"": "src"},
    packages=setuptools.find_packages(where="src"),
    # add any additional packages that
    install_requires=["python-docx", "openpyxl"],
    scripts=['bin/teacher_ivtc.py',
             'bin/teacher_ivtc_gui.py',
             'bin/teacher_ivtc_webui.py'],
    # needs to be installed along with your package. Eg: 'caer'

    keywords=['irregular verb', 'test', 'school', 'teacher'],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Education",
        "Programming Language :: Python :: 3",
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: Microsoft :: Windows",
        "Operating System :: POSIX :: Linux"
    ]
)
