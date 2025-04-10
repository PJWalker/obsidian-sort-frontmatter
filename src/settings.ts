import { App, PluginSettingTab, Setting, TextComponent } from "obsidian";
import Main from "./main";
import { updateComparator } from "./comparator";
import { sortBy } from "./comparator";

export interface Settings {
  sortStrategy: "codepoint" | "natural";
  locale: string;
}

export const DEFAULT_SETTINGS: Settings = {
  // Keeping things backward compatible by default
  sortStrategy: "codepoint",
  locale: navigator.language,
};

const previewItems = ["apple", "BANANA", "carrot", "11 Apples", "2D", "99luftballons"];

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

    let preview : Setting;
    const updatePreview = ()=> preview.setDesc(previewItems.sort(sortBy).join(", "))

    new Setting(containerEl)
      .setName("Sorting Strategy")
      .setDesc(`Should 'BANANA' go before 'apple'?`)
      .addDropdown(dropdown =>
        dropdown.addOption("codepoint", "Codepoint").addOption("natural", "Natural").onChange(async value => {
          this.plugin.settings.sortStrategy = value;
          await this.plugin.saveSettings()
          updateComparator(this.plugin.settings);
          updatePreview();

        })
    );

    new Setting(containerEl)
      .setName("Locale")
      .setDesc(
        `Use a custom locale for natural sorting (defaults to your system locale)`
      )
      .addText((text: TextComponent) =>
        text.setValue(this.plugin.settings.locale).setPlaceholder(`e.g: en, fr, es`).onChange(
          async (value) => {
            this.plugin.settings.locale = value;
            await this.plugin.saveSettings();
            updateComparator(this.plugin.settings);
            updatePreview();

          }
        )
    )
    preview = new Setting(containerEl).setName("Preview");
    updatePreview();
  }


}
