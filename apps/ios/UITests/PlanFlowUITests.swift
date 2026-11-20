import XCTest

/// Drives the main flow against a running API (SCENIC_API_BASE_URL, http://localhost:8787 by default).
final class PlanFlowUITests: XCTestCase {
    func testPlanSienaToPienza() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTestPlaces"] // fills Siena → Pienza without typing
        app.launch()
        // The app reopens on the last tab and mode: start from Plan → Go somewhere.
        if app.tabBars.buttons["Plan"].waitForExistence(timeout: 10) { app.tabBars.buttons["Plan"].tap() }
        let mode = app.segmentedControls["modePicker"]
        if mode.waitForExistence(timeout: 3) { mode.buttons.element(boundBy: 0).tap() }
        let plan = app.buttons["planButton"]
        XCTAssertTrue(plan.waitForExistence(timeout: 10))
        // The plan button sits below the style, interests and vehicle pickers: scroll it into view first.
        for _ in 0..<3 where plan.frame.maxY > app.windows.firstMatch.frame.maxY - 120 { app.swipeUp() }
        // On iOS 26 the ScrollView edge effect makes XCUITest report the button as not hittable; tap its centre.
        plan.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap()
        XCTAssertTrue(app.staticTexts["Most scenic"].waitForExistence(timeout: 90))
        // The first route card opens the detail screen.
        let card = app.buttons["routeCard0"]
        XCTAssertTrue(card.waitForExistence(timeout: 5))
        card.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap()
        XCTAssertTrue(app.descendants(matching: .any)["routeDetail"].waitForExistence(timeout: 10))
    }
}
