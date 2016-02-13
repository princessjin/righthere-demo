import openpyxl as px
from collections import defaultdict

def xl2json(filename):
    d = defaultdict(dict)
    wb = px.load_workbook(filename)
    sheet = wb.get_sheet_by_name('postage')

    for row in sheet.rows:
        postCode, suburb, zone, postage = row

        if (postCode.value is not None
                and suburb.value is not None
                and postage.value is not None):
            d[postCode.value][suburb.value] = postage.value
    return d
