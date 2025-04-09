import { App, Plugin, PluginManifest, TFile, Vault, Workspace } from "obsidian";
import { MarkdownParser } from "./parser/MarkdownParser";
import { Variant } from "./parser/MarkdownParser.types";
import { updateComparator } from "./utils";
import { DEFAULT_SETTINGS, SettingTab } from "./settings";

let workspace: Workspace,
  // fileManager: FileManager,
  vault: Vault;
export default class Main extends Plugin {
  settings: any;
  constructor(app: App, plugin: PluginManifest) {
    super(app, plugin);

    // fileManager = this.app.fileManager;
    workspace = this.app.workspace;
    vault = this.app.vault;
  }

  async #genSortFrontMatterWithinContents(
    tFile: TFile
  ): Promise<{ data: string; err: Error | null }> {
    const app = this.app;
    return new Promise((res, rej) => {
      vault.process(tFile, (file_contents) => {
        // https://regex101.com/r/7s4zjQ/1
        const regexStart = /^---(\r?\n)/g;
        // https://regex101.com/r/nx0lIA/1
        const regexEnd = /---(\r?\n|$)/g;
        const parser = new MarkdownParser(app, tFile, file_contents);
        const processed = parser.splitIntoFrontMatterAndContents(
          parser.file_contents,
          regexStart,
          regexEnd
        );
        if (!processed) {
          res({
            data: parser.file_contents,
            err: new Error("Frontmatter processing error occurred."),
          });
          return file_contents;
        }

        const { processedFrontMatter, processedNonFrontMatter } = processed;

        const sorted_file_contents =
          parser.replaceFileContentsWithSortedFrontMatter(
            processedFrontMatter.frontMatter || "",
            processedNonFrontMatter.content || ""
          );

        res({ data: sorted_file_contents, err: null });
        return sorted_file_contents;
      });
    });
  }

  public async genSortActiveFrontmatter(datums: unknown[]): Promise<void> {
    updateComparator(this.settings);
    await this.#genSortFrontMatterWithinContents(
      workspace.getActiveFile()
    );
  }

  public async genSortAllFrontmatter(datums: unknown[]): Promise<void> {
    updateComparator(this.settings);
    await Promise.all(
      vault.getFiles().map(
        file => this.#genSortFrontMatterWithinContents(file)
      )
    );
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async onload() {
    await this.loadSettings();
    updateComparator(this.settings);


    this.addCommand({
      id: "sort",
      name: "Sort frontmatter for current file",
      callback: async (...args) => {
        await this.genSortActiveFrontmatter(args);
      },
    });
    this.addCommand({
      id: "sortAll",
      name: "Sort all frontmatter in the vault",
      callback: async (...args) => {
        await this.genSortAllFrontmatter(args);
      },
    });

    this.addSettingTab(new SettingTab(this.app, this));
  }



  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {}
}
