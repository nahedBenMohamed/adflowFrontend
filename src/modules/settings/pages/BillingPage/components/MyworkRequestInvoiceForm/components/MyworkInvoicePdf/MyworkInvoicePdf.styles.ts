import { Font, StyleSheet } from '@react-pdf/renderer';
import timesNewRomanBold from '/fonts/TimesNewRoman/Bold/TimesNewRomanBold.ttf';
import timesNewRomanRegular from '/fonts/TimesNewRoman/Regular/TimesNewRomanRegular.ttf';

Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: timesNewRomanRegular, fontWeight: 'normal' },
    { src: timesNewRomanBold, fontWeight: 'bold' },
  ],
});

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Times New Roman',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
  },

  header: {
    marginBottom: 16,
    fontSize: 12,
  },
  headerText: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },

  headerTable: {
    fontSize: 10,
    width: '100%',
    border: '1px solid black',
    marginBottom: 24,
  },
  headerTableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  headerTableLeftCell: {
    padding: 4,
    width: '60%',
    borderRight: '1px solid black',
  },
  headerTableRightCell: {
    width: '40%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRightCellTitle: {
    width: '30%',
    padding: 4,
    flexShrink: 0,
    display: 'flex',
    borderRight: '1px solid black',
  },
  headerRightCellValue: {
    padding: 4,
    width: '70%',
  },
  headerTableRightInnerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
  },

  title: { textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom: 24 },

  productsTable: {
    display: 'flex',
    width: 'auto',
    flexDirection: 'column',
    margin: '10px 0 4px',
    border: '1px solid black',
  },
  productsTableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid black',
    fontSize: 10,
  },
  productsTableCell: { padding: 4, borderRight: '1px solid black' },

  footer: {
    marginTop: 12,
    fontSize: 10,
  },
  footerImagesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  footerImagesGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stamp: { width: 100, height: 100, marginTop: 10 },
  signature: { width: 80, height: 50, marginTop: 10 },
  qrCode: { width: 100, height: 100 },

  logoWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 40,
    height: 40,
  },
});
