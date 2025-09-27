import { UtcDate } from '@/shared';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { useEffect, useMemo, useState } from 'react';
import {
  convertPriceToRussianLocaleString,
  type MyworkInvoicePdfData,
} from '../../../../../../shared';
import { pdfStyles } from './MyworkInvoicePdf.styles';
import myworkSignature from '/images/invoice/mywork_signature.png';
import myworkSquareLogo from '/images/invoice/mywork_square_logo.png';
import myworkStamp from '/images/invoice/mywork_stamp.png';

interface Props {
  accountId: number;
  plan: string;
  numberOfUsers: number;
  period: string;
  amount: number;
  customerName: string;
  customerItn: string;
  customerAddress: string;
  periodAdditional?: string;
}

// period – месяц, год или пожизненный период
// plan – читаемое имя тарифа
// amount - цена за всех пользователей конечная

const PRODUCTS_TABLE_HEADER_CELLS: {
  width: string;
  text: string;
}[] = [
  { width: '5%', text: '№ п/п' },
  { width: '40%', text: 'Наименование товара (описание выполненных работ, оказанных услуг)' },
  { width: '10%', text: 'Ед. изм.' },
  { width: '10%', text: 'Кол-во' },
  { width: '15%', text: 'Цена за ед. изм., руб.' },
  { width: '20%', text: 'Стоимость товаров (работ, услуг), руб.' },
];

const MyworkInvoicePdf = (props: Props) => {
  const {
    accountId,
    plan,
    numberOfUsers,
    period,
    amount,
    customerName,
    customerItn,
    customerAddress,
    periodAdditional,
  } = props;

  const currentDateFormatted = useMemo<string>(
    () => `${UtcDate.now().format('DD.MM.YYYY')} г.`,
    []
  );

  const pdfData = useMemo<MyworkInvoicePdfData>(
    () => ({
      invoiceTitle: `СЧЁТ НА ОПЛАТУ № ${accountId} от ${currentDateFormatted}`,
      recipientData: [
        'ООО "МОЁ ПРОСТРАНСТВО" ИНН: 5528053088 КПП: 552801001',
        'Адрес: 644520, Омская обл, Омский р-н, село Троицкое, ул. 70 лет Победы, д 7',
      ],
      recipientDetails: {
        bic: '045209673',
        kpp: '552801001',
        itn: '5528053088',
        ogrn: '1235500016817',
        recipient: 'ООО "МОЁ ПРОСТРАНСТВО"',
        accountNumber: '40702810045000005840',
        correspondentAccount: '30101810900000000673',
        bank: 'ОМСКОЕ ОТДЕЛЕНИЕ № 8634 ПАО СБЕРБАНК',
      },
      customerData: [
        `Плательщик: ${customerName}, ИНН: ${customerItn}`,
        `Адрес: ${customerAddress}`,
      ],
      customerPlanData: {
        plan,
        period,
        numberOfUsers,
      },
      productName: `Оплата по счёту № ${accountId} за ${period} подписку Mywork (mywork.app)${periodAdditional ?? ''}, тариф "${plan}" на ${numberOfUsers} пользователя/пользователей`,
      amountNumber: amount,
      amountText: convertPriceToRussianLocaleString(amount),
    }),
    [
      plan,
      period,
      amount,
      accountId,
      customerItn,
      customerName,
      numberOfUsers,
      customerAddress,
      periodAdditional,
      currentDateFormatted,
    ]
  );

  const [qrCodeImage, setQrCodeImage] = useState('');

  useEffect(() => {
    const generateQRCode = async (): Promise<void> => {
      try {
        // Specific keys for QR, change and add carefully!
        const qrData = `ST00012|
Name=${pdfData.recipientDetails.recipient}|
PersonalAcc=${pdfData.recipientDetails.accountNumber}|
BankName=${pdfData.recipientDetails.bank}|
BIC=${pdfData.recipientDetails.bic}|
CorrespAcc=${pdfData.recipientDetails.correspondentAccount}|
Sum=${pdfData.amountNumber}00|
Purpose=Оплата по счёту № ${accountId} от ${currentDateFormatted} за ${period} подписку Mywork (mywork.app) тариф "${pdfData.customerPlanData.plan}" на ${pdfData.customerPlanData.numberOfUsers} пользователя/пользователей|
PayeeINN=${pdfData.recipientDetails.itn}|
KPP=${pdfData.recipientDetails.kpp}|
OGRN=${pdfData.recipientDetails.ogrn}`;

        const qrCodeDataURL = await QRCode.toDataURL(qrData);

        setQrCodeImage(qrCodeDataURL);
      } catch (e) {
        console.error('Error generating QR code:', e);
      }
    };

    generateQRCode();
  }, [accountId, pdfData, period, currentDateFormatted]);

  const amountString = useMemo<string>(
    () => `${pdfData.amountNumber} (${pdfData.amountText})`,
    [pdfData.amountNumber, pdfData.amountText]
  );

  return (
    <Document>
      <Page style={pdfStyles.page} size="A4">
        <View>
          {/* Header Information */}
          <View style={pdfStyles.header}>
            {pdfData.recipientData.map(d => (
              <Text key={d} style={pdfStyles.headerText}>
                {d}
              </Text>
            ))}
          </View>

          {/* Header Table Structure */}
          <View style={pdfStyles.headerTable}>
            <View style={pdfStyles.headerTableRow}>
              <View style={pdfStyles.headerTableLeftCell}>
                <Text>{'Получатель:'}</Text>
                <Text>{pdfData.recipientDetails.recipient}</Text>
              </View>

              <View style={pdfStyles.headerTableRightCell}>
                <View style={pdfStyles.headerRightCellTitle}>
                  <Text>{'Р/сч. №'}</Text>
                </View>

                <View style={pdfStyles.headerRightCellValue}>
                  <Text>{pdfData.recipientDetails.accountNumber}</Text>
                </View>
              </View>
            </View>

            <View style={[pdfStyles.headerTableRow, { borderBottom: 'none' }]}>
              <View style={pdfStyles.headerTableLeftCell}>
                <Text>{'Банк получателя:'}</Text>
                <Text>{pdfData.recipientDetails.bank}</Text>
              </View>

              <View style={pdfStyles.headerTableRightCell}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <View style={pdfStyles.headerTableRightInnerRow}>
                    <View style={pdfStyles.headerRightCellTitle}>
                      <Text>{'БИК'}</Text>
                    </View>

                    <View style={pdfStyles.headerRightCellValue}>
                      <Text>{pdfData.recipientDetails.bic}</Text>
                    </View>
                  </View>

                  <View style={[pdfStyles.headerTableRightInnerRow, { borderBottom: 'none' }]}>
                    <View style={pdfStyles.headerRightCellTitle}>
                      <Text>{'К/сч. №'}</Text>
                    </View>

                    <View style={pdfStyles.headerRightCellValue}>
                      <Text>{pdfData.recipientDetails.correspondentAccount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Text style={pdfStyles.title}>{pdfData.invoiceTitle}</Text>

          {/* Customer data */}
          <View>
            <Text style={[pdfStyles.headerText]}>{pdfData.customerData[0]}</Text>

            <Text style={[pdfStyles.headerText]}>{pdfData.customerData[1]}</Text>
          </View>

          {/* Product Table */}
          <View style={pdfStyles.productsTable}>
            {/* Table Header */}
            <View style={[pdfStyles.productsTableRow, { backgroundColor: '#f5f5f5' }]}>
              {PRODUCTS_TABLE_HEADER_CELLS.map((c, idx) => (
                <Text
                  key={c.text}
                  style={[
                    pdfStyles.productsTableCell,
                    {
                      width: c.width,
                      borderRight:
                        idx === PRODUCTS_TABLE_HEADER_CELLS.length - 1 ? 'none' : '1px solid black',
                    },
                  ]}
                >
                  {c.text}
                </Text>
              ))}
            </View>

            {/* Table Rows */}
            <View style={pdfStyles.productsTableRow}>
              <Text style={[pdfStyles.productsTableCell, { width: '5%' }]}>{'1'}</Text>
              <Text style={[pdfStyles.productsTableCell, { width: '40%' }]}>
                {pdfData.productName}
              </Text>
              <Text style={[pdfStyles.productsTableCell, { width: '10%' }]}>{'шт.'}</Text>
              <Text style={[pdfStyles.productsTableCell, { width: '10%' }]}>{'1'}</Text>
              <Text style={[pdfStyles.productsTableCell, { width: '15%' }]}>
                {pdfData.amountNumber}
              </Text>
              <Text style={[pdfStyles.productsTableCell, { width: '20%', borderRight: 'none' }]}>
                {amountString}
              </Text>
            </View>

            {/* Summary Rows */}
            <View style={pdfStyles.productsTableRow}>
              <Text
                style={[
                  pdfStyles.productsTableCell,
                  { width: '80%', textAlign: 'right', fontWeight: 'bold' },
                ]}
              >
                {'Итого:'}
              </Text>
              <Text style={[pdfStyles.productsTableCell, { width: '20%', borderRight: 'none' }]}>
                {`${pdfData.amountNumber} (${pdfData.amountText})`}
              </Text>
            </View>

            <View style={pdfStyles.productsTableRow}>
              <Text style={[pdfStyles.productsTableCell, { width: '80%', textAlign: 'right' }]}>
                {'В том числе НДС (20%):'}
              </Text>
              <Text style={[pdfStyles.productsTableCell, { width: '20%', borderRight: 'none' }]}>
                {'–'}
              </Text>
            </View>

            <View
              style={[pdfStyles.productsTableRow, { fontWeight: 'bold', borderBottom: 'none' }]}
            >
              <Text style={[pdfStyles.productsTableCell, { width: '80%', textAlign: 'right' }]}>
                {'Всего к оплате:'}
              </Text>
              <Text style={[pdfStyles.productsTableCell, { width: '20%', borderRight: 'none' }]}>
                {amountString}
              </Text>
            </View>
          </View>

          {/* Footer with stamp and signature */}
          <View style={pdfStyles.footer}>
            <Text>{`Всего наименований: 1, на сумму ${amountString}`}</Text>

            <View>
              <Text style={[pdfStyles.headerText, { margin: '8px 0' }]}>
                {
                  'ВАЖНО: Для идентификации платежей и оперативной активации вашей платформы Mywork, пожалуйста, верно заполняйте назначение платежа в соответствующей графе платежного поручения.'
                }
              </Text>
            </View>

            <View style={pdfStyles.footerImagesWrapper}>
              <View style={pdfStyles.footerImagesGroup}>
                <Image style={pdfStyles.stamp} src={myworkStamp} />
                <Image style={pdfStyles.signature} src={myworkSignature} />
              </View>

              {qrCodeImage ? <Image style={pdfStyles.qrCode} src={qrCodeImage} /> : null}
            </View>
          </View>
        </View>

        <View style={pdfStyles.logoWrapper}>
          <Image style={pdfStyles.logo} src={myworkSquareLogo} />
        </View>
      </Page>
    </Document>
  );
};

export { MyworkInvoicePdf };
