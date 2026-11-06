// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { render, screen } from "@testing-library/react";
import { OxygenUIThemeProvider } from "@wso2/oxygen-ui";
import { describe, expect, it, vi } from "vitest";
import { resolveTheme } from "@config/themeConfig";
import type { UserInfo } from "../api/types";
import ProfileHero from "./ProfileHero";

vi.mock("./EmployeeQrDialog", () => ({ default: () => null }));

const user: UserInfo = {
  id: 1,
  employeeId: "E100",
  firstName: "Ada",
  lastName: "Lovelace",
  workEmail: "ada@wso2.com",
  employeeThumbnail: null,
  designation: "Engineer",
  privileges: [],
};

/** Emotion rules that name one of the element's generated classes. */
function rulesFor(element: Element): string {
  const generated = [...element.classList].filter((name) => name.startsWith("css-"));
  const css = [...document.querySelectorAll("style")].map((node) => node.textContent ?? "").join("\n");
  return css
    .split("}")
    .filter((rule) => generated.some((name) => rule.includes(`.${name}`)))
    .join("}");
}

function renderHero() {
  return render(
    <OxygenUIThemeProvider theme={resolveTheme("wso2")}>
      <ProfileHero userInfo={user} />
    </OxygenUIThemeProvider>,
  );
}

describe("ProfileHero", () => {
  it("renders Oxygen's QR icon on the view-QR button", () => {
    renderHero();
    const button = screen.getByRole("button", { name: "View QR code" });
    expect(button.querySelector("svg")).toHaveClass("lucide-qr-code");
  });

  it("rims the avatar in white in light mode and a warm tint in dark mode", () => {
    renderHero();
    const avatar = document.querySelector(".MuiAvatar-root");
    expect(avatar).not.toBeNull();
    const rules = rulesFor(avatar as Element);
    expect(rules).toContain("var(--oxygen-palette-common-white)");
    expect(rules).toContain("color-mix(in srgb, var(--oxygen-palette-primary-light) 62%, white)");
    expect(rules).toContain('data-color-scheme="dark"');
  });
});
