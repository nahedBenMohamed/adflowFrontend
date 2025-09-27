import DOMPurify from 'dompurify';
import type { MailMessagePayload } from '../..';

export const getMessageContentToDisplay = (
  payloads: MailMessagePayload[],
  fallbackContent: string = ''
): {
  isRenderingHTML: boolean;
  content: string;
} => {
  const payloadWithHTML = payloads.find(p => p.mimeType === 'text/html' && !p.filename);

  if (payloadWithHTML && payloadWithHTML.content) {
    // sanitize - to prevent exposing users to a cross-site scripting (XSS) attack
    // remove all <style> tags - to prevent exposing users to a CSS injection attack, override system styles
    return {
      isRenderingHTML: true,
      content: DOMPurify.sanitize(
        payloadWithHTML.content.replace(/<style([\s\S]*?)<\/style>/gi, '')
      ),
    };
  }

  const payloadWithPlainText = payloads.find(p => p.mimeType === 'text/plain' && !p.filename);

  if (payloadWithPlainText && payloadWithPlainText.content)
    return { isRenderingHTML: false, content: payloadWithPlainText.content };

  return {
    isRenderingHTML: false,
    content: fallbackContent,
  };
};
