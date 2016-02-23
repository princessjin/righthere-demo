import openpyxl as px
from collections import defaultdict

def xl2json(filename):
    d = defaultdict(dict)
    wb = px.load_workbook(filename)
    sheet = wb.get_sheet_by_name('postage')

    for row in sheet.rows:
        postCode, suburb, zone, postage = row

        if (postCode.value is not None and postage.value is not None):
            if suburb.value is not None:
                d[postCode.value][suburb.value] = postage.value
            else:
                d[postCode.value] = postage.value

    return d

import json
d = xl2json('./8003.xlsx')
#d = xl2json('./dynamic_pro.xlsx')
s = json.dumps(d)
fout = open('t', 'w')
fout.write(s)
fout.close()
