import { App, PluginSettingTab, Setting, TextComponent } from "obsidian";
import Main from "./main";
import { updateComparator } from "./utils";

export interface Settings {
  caseSensitive: boolean;
  numericSort: boolean;
  locale: string;
}

export const DEFAULT_SETTINGS: Settings = {
  // Keeping things backward compatible by default
  caseSensitive: true,
  numericSort: false,
  locale: navigator.language,
};

export class SettingTab extends PluginSettingTab {
  plugin: Main;
  constructor(app:App, plugin: Main) {
    super(app, plugin);
    this.plugin = plugin;
    this.app = app
  }
  display(): void {
    const { containerEl } = this;
    containerEl.empty();


    new Setting(containerEl)
      .setName("Case Sensitive")
      .setDesc(`Should 'B' go before 'a'?`)
      .addToggle(toggle =>
        toggle.setValue(this.plugin.settings.caseSensitive).onChange(
          async (value) => {
            this.plugin.settings.caseSensitive = value;
            await this.plugin.saveSettings();
            updateComparator(this.plugin.settings);
          }
        )
      );

    new Setting(containerEl)
      .setName("Numeric Sort")
      .setDesc(`Should 'Chapter 2' go before 'Chapter 10'?`)
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.numericSort)
          .onChange(async (value) => {
            this.plugin.settings.numericSort = value;
            await this.plugin.saveSettings();
            updateComparator(this.plugin.settings);
          })
      );

    new Setting(containerEl)
      .setName("Locale")
      .setDesc(
        `Use a custom locale for sorting (defaults to your system locale)`
      )
      .addText((text: TextComponent) =>
        text.setValue(this.plugin.settings.locale).setPlaceholder(`e.g: en, fr, es`).onChange(
          async (value) => {
            this.plugin.settings.locale = value;
            await this.plugin.saveSettings();
            updateComparator(this.plugin.settings);
          }
        )
      )
    }
}
