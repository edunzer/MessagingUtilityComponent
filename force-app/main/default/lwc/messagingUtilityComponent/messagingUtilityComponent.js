import { LightningElement, api, wire } from 'lwc'; // Make sure to import @wire from 'lwc'
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

    // Initialize an empty array for fields to track dynamically fetched fields.
    fields = [];

    // Dynamically get record fields from Salesforce
    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    record;

    closeMessage() {
        this.showMessage = false;
        const closeEvent = new CustomEvent('closemessage');
        this.dispatchEvent(closeEvent);
    }

    // Helper function to determine theme class
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

    // Getters to handle default values and dynamic field replacement
    get computedMessageBody() {
        return this.replacePlaceholders(this.messageBody || 'Message body not set');
    }

    get computedMessageTitle() {
        return this.replacePlaceholders(this.messageTitle || 'No Title');
    }

    // Replace {$Record.FieldName} placeholders with actual field values
    replacePlaceholders(text) {
        if (!text || !this.record?.data) {
            return text;
        }
        return text.replace(/\{\$Record\.(\w+)\}/g, (match, fieldName) => {
            const fieldValue = this.record.data.fields[fieldName]?.value;
            return fieldValue !== undefined ? fieldValue : match;
        });
    }

    // Extract fields dynamically based on placeholders in the messageTitle and messageBody
    connectedCallback() {
        this.fields = [
            ...this.extractFieldsFromTemplate(this.messageTitle),
            ...this.extractFieldsFromTemplate(this.messageBody)
        ].map(fieldName => `Account.${fieldName}`);
    }

    // Extract fields (e.g., Name, Industry) from template strings like {$Record.Name}
    extractFieldsFromTemplate(template) {
        const fieldMatches = template ? template.match(/\{\$Record\.(\w+)\}/g) : [];
        return fieldMatches ? fieldMatches.map(match => match.slice(9, -1)) : [];
    }

    get computedButtonLabel() {
        return this.buttonLabel || 'Okay';
    }

    // Alert message class
    get alertMessageClass() {
        return `slds-notify slds-notify_alert slds-theme_alert-texture ${this.getThemeClass()}`;
    }

    // Inline message class
    get inlineMessageClass() {
        return `slds-box slds-m-bottom--medium slds-theme_alert-texture ${this.getThemeClass()}`;
    }

    // Prompt message class
    get promptMessageClass() {
        return `slds-modal__header slds-theme_alert-texture ${this.getThemeClass()}`;
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
