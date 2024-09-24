import { LightningElement, api } from 'lwc';

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

    // Getters to handle default values
    get computedMessageBody() {
        return this.messageBody || 'Message body not set';
    }

    get computedMessageTitle() {
        return this.messageTitle || 'No Title';
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
