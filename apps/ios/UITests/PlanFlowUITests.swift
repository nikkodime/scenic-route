import XCTest

/// Drives the main flow against a running API (http://localhost:8787 by default).
final class PlanFlowUITests: XCTestCase {
    func testPlanSienaToPienza() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTestPlaces"] // fills Siena → Pienza without typing
        app.launch()
        let plan = app.buttons["planButton"]
        XCTAssertTrue(plan.waitForExistence(timeout: 10))
        plan.tap()
        XCTAssertTrue(app.staticTexts["Most scenic"].waitForExistence(timeout: 60))
    }
}
