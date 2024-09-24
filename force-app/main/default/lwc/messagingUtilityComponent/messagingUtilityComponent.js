import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class MessagingUtilityComponent extends LightningElement {
    @api showMessage;
    @api maxWidth;
    @api messageType;
    @api messageTitle;
    @api messageBody;
    @api messageVariant;
    @api showIcon;
    @api iconName = 'utility:check';
    @api iconSize = 'small';
    @api iconVariant = 'inverse';
    @api iconAlternativeText;
    @api allowClose;
    @api buttonLabel = 'Okay';
    @api recordId; // Record ID of the current record being viewed
    @api titleTextSize = 'medium'; // Default to medium size
    @api bodyTextSize = 'medium'; // Default to medium size

    fields = [];

    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    record;

    closeMessage() {
        this.showMessage = false;
        const closeEvent = new CustomEvent('closemessage');
        this.dispatchEvent(closeEvent);
    }

    getThemeClass() {
        switch (this.messageVariant) {
            case 'info':
                return 'slds-theme_info';
            case 'warning':
                return 'slds-theme_warning';
            case 'error':
                return 'slds-theme_error';
            case 'offline':
                return 'slds-theme_offline';
            case 'success':
                return 'slds-theme_success';
            default:
                return 'slds-theme_info';
        }
    }

    get computedMessageBody() {
        return this.replacePlaceholders(this.messageBody || 'Message body not set');
    }

    get computedMessageTitle() {
        return this.replacePlaceholders(this.messageTitle || 'No Title');
    }

    replacePlaceholders(text) {
        if (!text || !this.record?.data) {
            return text;
        }
        return text.replace(/\{\$Record\.(\w+)\}/g, (match, fieldName) => {
            const fieldValue = this.record.data.fields[fieldName]?.value;
            return fieldValue !== undefined ? fieldValue : match;
        });
    }

    connectedCallback() {
        this.fields = [
            ...this.extractFieldsFromTemplate(this.messageTitle),
            ...this.extractFieldsFromTemplate(this.messageBody)
        ].map(fieldName => `Account.${fieldName}`);
    }

    extractFieldsFromTemplate(template) {
        const fieldMatches = template ? template.match(/\{\$Record\.(\w+)\}/g) : [];
        return fieldMatches ? fieldMatches.map(match => match.slice(9, -1)) : [];
    }

    get computedButtonLabel() {
        return this.buttonLabel || 'Okay';
    }

    get alertMessageClass() {
        return `slds-notify slds-notify_alert slds-theme_alert-texture ${this.getThemeClass()}`;
    }

    get inlineMessageClass() {
        return `slds-box slds-m-bottom--medium slds-theme_alert-texture ${this.getThemeClass()}`;
    }

    get promptMessageClass() {
        return `slds-modal__header slds-theme_alert-texture ${this.getThemeClass()}`;
    }

    // CSS classes to control text size for title and body
    get titleTextSizeClass() {
        switch (this.titleTextSize) {
            case 'small':
                return 'slds-text-heading_small';
            case 'large':
                return 'slds-text-heading_large';
            default:
                return 'slds-text-heading_medium';
        }
    }

    get bodyTextSizeClass() {
        switch (this.bodyTextSize) {
            case 'small':
                return 'slds-text-body_small';
            case 'large':
                return 'slds-text-body_large';
            default:
                return 'slds-text-body_medium';
        }
    }

    get isAlert() {
        return this.messageType === 'alert';
    }

    get isInline() {
        return this.messageType === 'inline';
    }

    get isPrompt() {
        return this.messageType === 'prompt';
    }

    get containerWidth() {
        return this.maxWidth ? `max-width:${this.maxWidth}%` : 'max-width:100%';
    }
}
