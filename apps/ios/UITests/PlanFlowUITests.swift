import XCTest

/// Drives the main flow against a running API (SCENIC_API_BASE_URL, http://localhost:8787 by default).
final class PlanFlowUITests: XCTestCase {
    func testPlanSienaToPienza() throws {
        let app = XCUIApplication()
        app.launchArguments = ["-uiTestPlaces"] // fills Siena → Pienza without typing
        app.launch()
        let plan = app.buttons["planButton"]
        XCTAssertTrue(plan.waitForExistence(timeout: 10))
        // On iOS 26 the ScrollView edge effect makes XCUITest report the button as not hittable; tap its centre.
        plan.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap()
        XCTAssertTrue(app.staticTexts["Most scenic"].waitForExistence(timeout: 90))
    }
}
